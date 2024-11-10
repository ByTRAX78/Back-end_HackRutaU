exports.handler = async (event, context) => {
    console.log("Main Index");

    // TODO:
    // Call anal.js
    // Call patrones_movilidad
    // Call etc


    result = {"anals": {}, "patronesMovilidad": {}}

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
