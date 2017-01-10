import { MonUploadMat2Page } from './app.po';

describe('mon-upload-mat2 App', function() {
  let page: MonUploadMat2Page;

  beforeEach(() => {
    page = new MonUploadMat2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
