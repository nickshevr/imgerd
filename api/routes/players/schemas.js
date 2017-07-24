const balanceCRUDSchema = (withPoints = false) => {
    return {
        properties: {
            playerId: {
                type: 'string',
                required: true,
            },
            points: {
                type: 'string',
                required: withPoints,
            }
        }
    }
};

exports.queryWithoutPoints = balanceCRUDSchema();
exports.queryWithPoints = balanceCRUDSchema(true);