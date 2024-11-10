exports.handler = async (event, context) => {
    console.log("Main Index");

    // TODO:
    // Call anal.js
    // Call patrones_movilidad
    // Call etc


    result = {"anals": {}, "patronesMovilidad": {}}

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
