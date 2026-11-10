import Router from 'koa-router';
import { Starship } from '../../../models/index.js';
import { auth, authz, cache } from '../../../middleware/index.js';

const router = new Router({
  prefix: '/(v4|latest)/starship',
});

// Get all Starship flights/tests
router.get('/', cache(300), async (ctx) => {
  try {
    const result = await Starship.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one Starship flight by id
router.get('/:id', cache(300), async (ctx) => {
  const result = await Starship.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

// Query Starship flights
router.post('/query', cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Starship.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create Starship flight
router.post('/', auth, authz('starship:create'), async (ctx) => {
  try {
    const flight = new Starship(ctx.request.body);
    await flight.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update Starship flight
router.patch('/:id', auth, authz('starship:update'), async (ctx) => {
  try {
    await Starship.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete Starship flight
router.delete('/:id', auth, authz('starship:delete'), async (ctx) => {
  try {
    await Starship.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

export default router;

