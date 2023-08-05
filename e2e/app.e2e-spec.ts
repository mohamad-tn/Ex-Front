import { ExchangeTemplatePage } from './app.po';

describe('Exchange App', function() {
  let page: ExchangeTemplatePage;

  beforeEach(() => {
    page = new ExchangeTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
