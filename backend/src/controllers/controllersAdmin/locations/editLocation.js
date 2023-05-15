require('dotenv').config({ path: '.env' })
const Location = require("../../../model/locations");
const { _idMongooseRegex, nameLocationRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const editLocation = async (req, res) => {
    const { ...inputs } = req.body;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
        { input: 'name', dataType: 'string', regex: nameLocationRegex },
    ]

    // Función validateInput que toma tres argumentos: el valor del campo, el tipo de datos que se espera y la expresión regular que se utilizará para validar el valor.
    // La función verifica si el valor del campo es válido según los criterios especificados y devuelve true o false.
    const validateInput = (input, dataName, dataType, regex) => {
        if (dataType === 'string') {
            return typeof input === 'string' && regex.test(input);
        }
        if (dataType === 'array') {
            return Array.isArray(input) && input.every(element => regex.test(element)); // Método every para iterar sobre cada uno de los elementos del arreglo y comprobar si cada elemento cumple con la expresión regular
        }
        if (dataType === 'object') {
            return typeof input === 'object' && input !== null &&
                dataArray.every(({ input: requiredInput, properties, regex: requiredRegex }) => {
                    if (requiredInput !== dataName) return true;
                    return properties.every(prop => input.hasOwnProperty(prop) && requiredRegex.test(input[prop]));
                });
        }
        return false;
    };

    // El ciclo recorre cada elemento de la matriz dataArray y llama a validateInput con el valor correspondiente del campo del objeto JSON, el tipo de datos y la expresión regular.
    // Si el valor del campo no es válido según los criterios especificados, se devuelve un mensaje de error.
    for (const { input, dataType, regex } of dataArray) {
        const inputValue = inputs[input];
        if (!validateInput(inputValue, input, dataType, regex)) {
            return res.status(422).json({ message: `El valor de ${input} no es válido` });
        }
    }

    try {
        const existingName = await Location.findOne({ name: inputs.name });
        if (existingName) {
            return res.status(409).json({ message: "Ya existe esta localidad" });
        }

        const existingId = await Location.findOne({ _id: inputs._id });
        if (!existingId) {
            return res.status(404).json({ message: "No existe el _id" });
        }

        const query = { _id: inputs._id };
        const update = { name: inputs.name };
        await Location.findByIdAndUpdate(query, update);
        const updatedElement = await Location.findOne(query);

        res.status(200).json({ message: "Localidad actualizada correctamente", ans: updatedElement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la localidad" });
    }
}

module.exports = editLocation