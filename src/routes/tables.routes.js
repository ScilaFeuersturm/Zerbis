const express = require('express');
const authMiddleware = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');
const tableService = require('../services/table.service');

const router = express.Router();

router.use(authMiddleware);

router.get('/:table', requirePermission('read'), async (req, res, next) => {
  try {
    const data = await tableService.listRows(req.params.table, req.query);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get('/:table/:id', requirePermission('read'), async (req, res, next) => {
  try {
    const row = await tableService.getById(req.params.table, req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    return res.json(row);
  } catch (error) {
    return next(error);
  }
});

router.post('/:table', requirePermission('create'), async (req, res, next) => {
  try {
    const result = await tableService.createRow(req.params.table, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.put('/:table/:id', requirePermission('update'), async (req, res, next) => {
  try {
    const result = await tableService.updateRow(req.params.table, req.params.id, req.body);

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Registro no encontrado para actualizar.' });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:table/:id', requirePermission('delete'), async (req, res, next) => {
  try {
    const result = await tableService.deleteRow(req.params.table, req.params.id);

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Registro no encontrado para eliminar.' });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
