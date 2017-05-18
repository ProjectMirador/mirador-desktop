const $ = require('jquery');
const CircularJSON = require('circular-json');
const electron = require('electron');

const ipc = electron.ipcRenderer;
const remote = electron.remote;
const main = remote.require('./main');

let mirador = null;
const manifests = {};

const init = () => {
  $('body').css('background', 'none');
  $('.desktop-open').on('click', () => { main.openImageFile(); });
  $('.desktop-export').on('click', () => {
    const currentConfig = mirador.saveController.currentConfig;
    currentConfig.data = currentConfig.data.map((item) => {
      if (item.manifestUri in manifests) {
        return {
          manifestUri: item.manifestUri,
          manifestContent: manifests[item.manifestUri],
          location: item.location,
        };
      }
      return item;
    });
    main.exportWorkspace(CircularJSON.stringify(currentConfig));
  });
  $('.desktop-import').on('click', () => { main.importWorkspace(); });
  // Publishing is not implemented yet
  const disabledStyle = { opacity: 0.4, cursor: 'not-allowed' };
  $('.desktop-publish').css(disabledStyle);
  $('.desktop-publish').hover(() => { $(this).css(disabledStyle); });
};

const loadWorkspace = (miradorConfig) => {
  let config = miradorConfig;
  if (!config) {
    $('<div/>', { id: 'viewer' }).appendTo('body');
    config = {
      layout: '1x1',
      windowObjects: [],
      annotationEndpoint: { name: 'Local Storage', module: 'LocalStorageEndpoint' },
      sidePanelOptions: {
        tocTabAvailable: true,
        layersTabAvailable: true,
        searchTabAvailable: true,
      },
    };
    const data = [
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/drs:48309543', location: 'Harvard University' },
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/drs:5981093', location: 'Harvard University' },
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/via:olvwork576793', location: 'Harvard University' },
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/drs:14033171', location: 'Harvard University' },
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/drs:46909368', location: 'Harvard University' },
      { manifestUri: 'https://iiif.lib.harvard.edu/manifests/drs:48331776', location: 'Harvard University' },
      { manifestUri: 'http://iiif.harvardartmuseums.org/manifests/object/299843', location: 'Harvard University' },
      { manifestUri: 'http://iiif.harvardartmuseums.org/manifests/object/304136', location: 'Harvard University' },
      { manifestUri: 'http://iiif.harvardartmuseums.org/manifests/object/198021', location: 'Harvard University' },
      { manifestUri: 'http://iiif.harvardartmuseums.org/manifests/object/320567', location: 'Harvard University' },
      { manifestUri: 'https://purl.stanford.edu/qm670kv1873/iiif/manifest.json', location: 'Stanford University' },
      { manifestUri: 'https://purl.stanford.edu/jr903ng8662/iiif/manifest.json', location: 'Stanford University' },
      { manifestUri: 'https://purl.stanford.edu/ch264fq0568/iiif/manifest.json', location: 'Stanford University' },
      { manifestUri: 'https://purl.stanford.edu/wh234bz9013/iiif/manifest.json', location: 'Stanford University' },
      { manifestUri: 'https://purl.stanford.edu/rd447dz7630/iiif/manifest.json', location: 'Stanford University' },
      { manifestUri: 'http://dms-data.stanford.edu/data/manifests/Stanford/ege1/manifest.json', location: 'Stanford University' },
      { manifestUri: 'http://dams.llgc.org.uk/iiif/4574752/manifest.json', location: 'National Library of Wales' },
      { manifestUri: 'http://dev.llgc.org.uk/iiif/ww1posters.json', location: 'National Library of Wales' },
      { manifestUri: 'http://dams.llgc.org.uk/iiif/newspaper/issue/3320640/manifest.json', location: 'National Library of Wales' },
      { manifestUri: 'http://dams.llgc.org.uk/iiif/2.0/1465298/manifest.json', location: 'National Library of Wales' },
      { manifestUri: 'http://manifests.ydc2.yale.edu/manifest/Admont23', location: 'Yale University' },
      { manifestUri: 'http://manifests.ydc2.yale.edu/manifest/Admont43', location: 'Yale University' },
      { manifestUri: 'http://manifests.ydc2.yale.edu/manifest/BeineckeMS10', location: 'Yale University' },
      { manifestUri: 'https://manifests.britishart.yale.edu/manifest/5005', location: 'Yale Center For British Art' },
      { manifestUri: 'https://manifests.britishart.yale.edu/manifest/1474', location: 'Yale Center For British Art' },
      { manifestUri: 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/51a65464-6408-4a78-9fd1-93e1fa995b9c.json', location: 'Bodleian Libraries' },
      { manifestUri: 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/f19aeaf9-5aba-4cee-be32-584663ff1ef1.json', location: 'Bodleian Libraries' },
      { manifestUri: 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/3b31c0a9-3dab-4801-b3dc-f2a3e3786d34.json', location: 'Bodleian Libraries' },
      { manifestUri: 'http://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json', location: 'Bodleian Libraries' },
      { manifestUri: 'http://gallica.bnf.fr/iiif/ark:/12148/btv1b84539771/manifest.json', location: 'BnF' },
      { manifestUri: 'http://gallica.bnf.fr/iiif/ark:/12148/btv1b10500687r/manifest.json', location: 'BnF' },
      { manifestUri: 'http://gallica.bnf.fr/iiif/ark:/12148/btv1b55002605w/manifest.json', location: 'BnF' },
      { manifestUri: 'http://gallica.bnf.fr/iiif/ark:/12148/btv1b55002481n/manifest.json', location: 'BnF' },
      { manifestUri: 'http://www.e-codices.unifr.ch/metadata/iiif/sl-0002/manifest.json', location: 'e-codices' },
      { manifestUri: 'http://www.e-codices.unifr.ch/metadata/iiif/bge-cl0015/manifest.json', location: 'e-codices' },
      { manifestUri: 'http://www.e-codices.unifr.ch/metadata/iiif/fmb-cb-0600a/manifest.json', location: 'e-codices' },
      { manifestUri: 'https://data.ucd.ie/api/img/manifests/ucdlib:33064', location: 'University College Dublin' },
      { manifestUri: 'https://data.ucd.ie/api/img/manifests/ucdlib:40851', location: 'University College Dublin' },
      { manifestUri: 'https://data.ucd.ie/api/img/manifests/ucdlib:30708', location: 'University College Dublin' },
      { manifestUri: 'http://dzkimgs.l.u-tokyo.ac.jp/iiif/zuzoubu/12b02/manifest.json', location: 'University of Tokyo' },
      { manifestUri: 'http://www2.dhii.jp/nijl/NIJL0018/099-0014/manifest_tags.json', location: 'NIJL' },
      { manifestUri: 'http://digi.vatlib.it/iiif/MSS_Vat.lat.3225/manifest.json', location: 'Vatican Library' },
      { manifestUri: 'http://media.nga.gov/public/manifests/nga_highlights.json', location: 'National Gallery of Art' },
      { manifestUri: 'http://demos.biblissima-condorcet.fr/iiif/metadata/BVMM/chateauroux/manifest.json', location: 'Biblissima' },
      { manifestUri: 'https://manifests.britishart.yale.edu/Osbornfa1', location: 'Yale Beinecke' },
      { manifestUri: 'http://media.nga.gov/public/manifests/nga_highlights.json', location: 'National Gallery of Art' },
    ];
    config.data = data;
    config.openManifestsPage = true;
  } else {
    mirador = null;
    $('#viewer').html('');
  }
  config.id = 'viewer';
  config.mainMenuSettings = {
    userButtons: [
      {
        attributes: {
          class: 'desktop-open',
        },
        iconClass: 'fa fa-lg fa-fw fa-picture-o',
        label: 'Open',
      }, {
        attributes: {
          class: 'desktop-publish',
        },
        iconClass: 'fa fa-lg fa-fw fa-newspaper-o',
        label: 'Publish',
      }, {
        attributes: {
          class: 'desktop-import',
        },
        iconClass: 'fa fa-lg fa-fw fa-upload',
        label: 'Import',
      }, {
        attributes: {
          class: 'desktop-export',
        },
        iconClass: 'fa fa-lg fa-fw fa-download',
        label: 'Export',
      },
    ],
    userLogo: {
      label: 'Mirador Desktop',
      iconClass: 'fa fa-lg fa-fw fa-sliders',
    },
  };
  config.buildPath = './assets/mirador/';
  mirador = Mirador(config);
  mirador.eventEmitter.subscribe('mainMenuInitialized', init);
};

ipc.on('manifest-file-opened', (event, manifestUri, manifestId, files, content) => {
  const manifestContent = JSON.parse(content);
  manifests[manifestUri] = manifestContent;
  mirador.viewer.addManifestFromUrl(manifestUri, 'Local files', manifestContent);
});

ipc.on('workspace-file-opened', (event, file, content) => loadWorkspace(JSON.parse(content)));

$(document).ready(() => loadWorkspace());
