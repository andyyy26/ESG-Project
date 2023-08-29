class Page {
  constructor(page) {
    this.id = page.id;
    this.title = page.title;
    this.description = page.description;
    this.image = page.image;
    this.status = page.status;
  }
}

module.exports = Page;