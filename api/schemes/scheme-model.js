const db = require('../../data/db-config')

function findStepsForScheme(id) {
    return db('steps')
        .innerJoin('schemes', 'schemes.id', 'steps.scheme_id')
        .where('scheme_id', id)
        .select('steps.id', 'step_number', 'steps.instructions', 'schemes.scheme_name')
        .orderBy('step_number', 'asc')
}

module.exports = {
    findStepsForScheme,
}