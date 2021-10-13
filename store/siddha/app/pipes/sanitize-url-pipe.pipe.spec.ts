import { SanitizeUrlPipePipe } from './sanitize-url-pipe.pipe';

describe('SanitizeUrlPipePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeUrlPipePipe();
    expect(pipe).toBeTruthy();
  });
});
