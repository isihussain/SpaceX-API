import Router from 'koa-router';
import { Raptor } from '../../../models/index.js';
import { auth, authz, cache } from '../../../middleware/index.js';

const router = new Router({
  prefix: '/(v4|latest)/raptors',
});

// Get all raptor engines
router.get('/', cache(86400), async (ctx) => {
  try {
    const result = await Raptor.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one raptor engine
router.get('/:id', cache(86400), async (ctx) => {
  const result = await Raptor.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

// Query raptor engines
router.post('/query', cache(86400), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Raptor.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create raptor engine
router.post('/', auth, authz('raptors:create'), async (ctx) => {
  try {
    const raptor = new Raptor(ctx.request.body);
    await raptor.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update raptor engine
router.patch('/:id', auth, authz('raptors:update'), async (ctx) => {
  try {
    await Raptor.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete raptor engine
router.delete('/:id', auth, authz('raptors:delete'), async (ctx) => {
  try {
    await Raptor.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

export default router;

