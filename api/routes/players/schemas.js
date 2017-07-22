exports.balanceCRUDSchema = (withPoints = false) => {
    return {
        properties: {
            playerId: {
                type: 'string',
                required: true,
            },
            withPoints: {
                type: 'string',
                required: withPoints,
            }
        }
    }
};
