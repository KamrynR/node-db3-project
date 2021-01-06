const express = require('express')
const db = require('../../data/db-config')
const schemeModel = require('./scheme-model')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await db('schemes'))
  } catch(err) {
    next(err)
  }
})

router.get('/:id', validateSchemeId(), async (req, res, next) => {
  try {
    res.status(200).json(req.scheme)
  } catch(err) {
    next(err)
  }
})

router.get('/:id/steps', validateSchemeId(), async (req, res, next) => {
  try {
    const steps = await schemeModel.findStepsForScheme(req.params.id)
    
    res.status(200).json(steps)
  } catch(err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const [id] = await db("schemes").insert(req.body)
		const scheme = await db("schemes").where({ id }).first()

		res.status(201).json(scheme)
  } catch(err) {
    next(err)
  }
})

router.post('/:id/steps', validateSchemeId(), async (req, res, next) => {
  try {
    const schemeId = req.params.id
    const stepData = req.body
    stepData.scheme_id = schemeId
    await db('steps').insert(stepData)

    const [step] = await db('steps')
      .select('id', 'step_number', 'instructions', 'scheme_id')
      .orderBy('id', 'desc')
      .limit('1')

    res.status(201).json(step)
  } catch(err) {
    next(err)
  }
})

router.put('/:id', validateSchemeId(), async (req, res, next) => {
  try {
    const { id } = req.params
    await db("schemes").where({ id }).update(req.body)
    const scheme = await db("schemes").where({ id }).first()

		res.status(200).json(scheme)
  } catch(err) {
    next(err)
  }
})

router.delete('/:id', validateSchemeId(), async (req, res, next) => {
  try {
    const { id } = req.params
    await db('schemes').where({ id }).del()

    res.status(204).end()
  } catch(err) {
    next(err)
  }
})

function validateSchemeId() {
	return async (req, res, next) => {
		try {
			const { id } = req.params
			const scheme = await db("schemes").where({ id }).first()

			if (!scheme) {
				return res.status(404).json({
					message: "Scheme not found",
				})
			}

			req.scheme = scheme
			next()
		} catch(err) {
			next(err)
		}
	}
}

module.exports = router
