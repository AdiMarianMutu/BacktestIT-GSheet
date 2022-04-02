const app = new App();
const backend = new Backend();
const env = {
  github_repo_issues_url: 'https://github.com/AdiMarianMutu/BacktestPortfolio/issues',
  my_linkedin_url: 'https://www.linkedin.com/in/mutu-adi-marian/'
};

function onOpen() {
  init();

  app.get().getUi()
      .createMenu('Backtest')
      .addItem('Refresh', 'init')
      .addToUi();
}

function init() {
  app.sheets.data.clear();

  setDataTabStatus('init');

  openFrontend();
}

// Called by the front-end
function getData() { return backend.getData(); }

function setDataTabStatus(status) { backend.setDataTabStatus(status); }

function openFrontend() {
  const calcDim = (num) => Math.round(num * 28);

  const minDimW = calcDim(50);
  const minDimH = calcDim(20);
  let width = calcDim(backend.h.parameters.get('width'));
  let height = calcDim(backend.h.parameters.get('height'));
  width = width < minDimW ? minDimW : width;
  height = height < minDimH ? minDimH : height;

  SpreadsheetApp.getUi().showModalDialog(generateFrontend().evaluate().setWidth(width).setHeight(height), 'Backtest Chart');
}

function generateFrontend() {
  return HtmlService.createTemplate(loadDependencies(getFrontendFileContent('index')));
}

function loadDependencies(content) {
  const getEnvVar = (envName) => {
    return env[envName.replace('<?', '').replace('?>', '')];
  };

  const dep = content.match(/{{(?:.*?)}}/gm);

  const envVars = content.match(/<\?(?:.*?)\?>/gm);
  if (envVars !== null) {
    envVars.forEach((env) => {
      content = content.replace(env, getEnvVar(env));
    });
  }

  if (dep !== null) {
    dep.forEach((d) => {
      const fileName = d.match(/(?<=\{{).+?(?=\}})/g)[0];
      let fileContent = getFrontendFileContent(fileName);

      if (fileName !== 'main.js' && fileName.includes('.js'))
        fileContent = fileContent.replace('<script>', '').replace('</script>', '');

      content = content.replaceAll(d, fileContent);
    });

    // Recursively load all nested dependencies
    if (content.match(/{{(?:.*?)}}/gm) !== null)
      return loadDependencies(content);
  }

  return content;
}

function getFrontendFileContent(fileName) {
  return HtmlService.createTemplateFromFile(`fe_${fileName.replace('.html', '')}.html`).getRawContent();    
}