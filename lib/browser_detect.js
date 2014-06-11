(function (exports) {

  function extractOS (userAgent) {
    var
      name,
      version = NaN;

    if (/windows nt/i.test(userAgent)) {
      name = 'windows';
      try {
        version = parseFloat(userAgent.match(/windows nt ([\d.]+)/i)[1]);
      } catch (e) {}
    } else if (/ipad|iphone|ipod/i.test(userAgent)) {
      name = 'ios';
      try {
        version = parseFloat(userAgent.match(/cpu (?:\w+ )?os ([\d_]+)/i)[1].replace(/_/g, '.'));
      } catch (e) {}
    } else if (/mac\s?os\s?x/i.test(userAgent)) {
      name = 'mac';
      try {
        version = parseFloat(userAgent.match(/mac\s?os\s?x\s?(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/android/i.test(userAgent)) {
      name = 'android';
      try {
        version = parseFloat(userAgent.match(/android\s?(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/linux/i.test(userAgent)) {
      name = 'linux';
      try {
        version = parseFloat(userAgent.match(/linux\s?(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/blackberry/i.test(userAgent)) {
      name = 'blackberry';
      try {
        version = parseFloat(userAgent.match(/version\/(\d+\.\d+)/i)[1]);
      } catch (e) {}
    }

    return {
      name: name,
      version: version
    };
  }

  function extractBrowser (userAgent) {
    var
      name,
      version = NaN;

    if (/chrome|cri?os/i.test(userAgent)) {
      name = 'chrome';
      try {
        version = parseFloat(userAgent.match(/(?:chrome|cri?os)\/(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/firefox/i.test(userAgent)) {
      name = 'firefox';
      try {
        version = parseFloat(userAgent.match(/firefox\/(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/safari/i.test(userAgent)) {
      name = 'safari';
      try {
        version = parseFloat(userAgent.match(/version\/(\d+\.\d+)/i)[1]);
      } catch (e) {}
    } else if (/opera/i.test(userAgent)) {
      name = 'opera';
      try {
        //version = parseFloat(userAgent.match(/(?:version|opera)[\/ ](\d+\.\d+)/i)[1]);
        version = parseFloat((
          userAgent.match(/version\/(\d+\.\d+)/i) ||
          userAgent.match(/opera (\d+\.\d+)/i)
        )[1]);
      } catch (e) {}
    } else if (/(ms|\b)?(ie|rv)/i.test(userAgent)) {
      name = 'ie';
      try {
        version = parseFloat(userAgent.match(/(?:ms|\b)?(?:ie|rv) (\d+\.\d+)/i)[1]);
      } catch (e) {}
    }

    return {
      name: name,
      version: version
    };
  }

  function featureDetectBrowser () {
    var
      name,
      version = NaN,
      pinned = false,
      retina = false,
      body, style;

    try {
      body = document.body;
      style = body.style;

      if (undefined !== style.scrollbar3dLightColor) {
        name = 'ie';

        if (       undefined !== style.borderImage) {
          version = 11;
        } else if (undefined !== style.transition) {
          version = 10;
        } else if (undefined !== style.opacity) {
          version = 9;
        } else if (undefined !== style.msBlockProgression) {
          version = 8;
        } else if (undefined !== style.msInterpolationMode) {
          version = 7;
        } else if (undefined !== style.textOverflow) {
          version = 6;
        }

        if (version === 9 || version === 10) {
          if (('msIsSiteMode' in window.external) && window.external.msIsSiteMode()) {
            pinned = true;
          }
        }
      } else if (window.chrome && body.dataset) {
        name = 'chrome';
      } else if (undefined !== navigator.mozIsLocallyAvailable) {
        name = 'firefox';
      } else if (undefined !== window.opera) {
        name = 'opera';
      }

      if (window.devicePixelRatio && 1 < window.devicePixelRatio) {
        retina = true;
      }
    } catch (e) {
      if (window.console && console.error) {
        console.error(e, e.stack);
      }
    }

    return {
      browserName: name,
      browserVersion: version,
      pinned: pinned,
      retina: retina
    };
  }

  function analyzeUserAgent (userAgent) {
    return {
      os: extractOS(userAgent),
      browser: extractBrowser(userAgent),
      chromeframe: /chromeframe/i.test(userAgent),
      mobile: /android|iphone|ipad|ipod/i.test(userAgent)
    };
  }

  function analyze () {
    var
      tokens = [],
      analysis = analyzeUserAgent(navigator.userAgent),
      features = featureDetectBrowser();

    if (analysis.os.name !== undefined) {
      tokens.push(analysis.os.name);

      if (!isNaN(analysis.os.version)) {
        tokens.push(analysis.os.name + analysis.os.version.toString().replace(/[.]/g, '_'));
      }
    }

    if (analysis.browser.name !== undefined) {
      tokens.push(analysis.browser.name);

      if (!isNaN(analysis.browser.version)) {
        tokens.push(analysis.browser.name + analysis.browser.version.toString().replace(/[.]/g, '_'));
      }
    }

    if (analysis.chromeframe) {
      tokens.push('chromeframe');
    }

    tokens.push((analysis.mobile ? '' : 'no-') + 'mobile');
    tokens.push((features.retina ? '' : 'no-') + 'retina');

    if (analysis.browser.name !== features.browserName && analysis.browserName !== undefined && features.browserName !== undefined) {
      // TODO
    } else if (analysis.browser.name === 'ie' &&
               analysis.browser.version !== features.browserVersion) {
      tokens.push('compatibilitymode');
      tokens.push('iecm' + features.browserVersion);
    }
  }

  function render (tokens) {
    document.documentElement.className += ' ' + tokens.join(' ');
  }

  function init () {
    try {
      render(analyze());
    } catch (e) {
      if (window.console && console.error) {
        console.error(e, e.stack);
      }
    }
  }

  this.__browserDetect = { // exposed for testing purposes
    version: '@@version',
    analyze: analyze,
    analyzeUserAgent: analyzeUserAgent,
    extractOS: extractOS,
    extractBrowser: extractBrowser,
    featureDetectBrowser: featureDetectBrowser
  };

  init();
}(this));
