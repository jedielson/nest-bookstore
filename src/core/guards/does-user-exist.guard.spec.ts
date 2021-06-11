import { DoesUserExistGuard } from './does-user-exist.guard';

describe('DoesUserExistGuard', () => {
  it('should be defined', () => {
    expect(new DoesUserExistGuard(null)).toBeDefined();
  });
});
