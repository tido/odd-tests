
export const assertTemplatePath = (templatePath, rendition) => {
  if (!templatePath) {
    throw new Error(`could not find template for rendition "#${rendition}"`);
  }
};

export const assertValid = (report) => {
  const errors = report.getErrors();

  if (errors.length) {
    const messages = errors.map(error => error.toString()).join('\n');
    throw new Error(`expected XML to be valid\n${messages}`);
  }
};

export const assertInvalid = (report) => {
  if (report.isValid) {
    throw new Error('expected XML to be invalid');
  }
};
