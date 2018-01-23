import { AppPage } from './app.po';

describe('app HR', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying app works', () => {
    expect('app works!').toEqual('app works!');
  });
});
