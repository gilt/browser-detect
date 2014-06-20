/*! browser_detect v0.1.0 2014-06-20 */
(function (exports, undefined) {
  // http://tools.ietf.org/html/rfc4646
  var
    LOCALE_REGEX = new RegExp(
      '^' +
        '(?:' +
          '(?:' +
            '(?:' + // language

              '(' + // [1]
                'q?' + // private use
                '[a-z]{2}' + // ISO-639
              ')' +

              '(' + // [2] extlangs
                '(?:' +
                  '[_-]' +
                  '[a-z]{3}' + // language extension (reserved for future use)
                '){0,3}' +
              ')' +

            '|' +
              '([a-z]{4})' + // [3] reserved for future use
            '|' +
              '([a-z]{5,8})' + // [4] registered language subtag
            ')' +

            '(?:' +
              '[_-]' +
              '([A-Z][a-z]{3})' + // [5] ISO-15924 (script)
            ')?' + // script

            '(?:' +
              '[_-]' +
              '(' + // [6] region
                '[A-Z]{2}' + // ISO-3166-2
              '|' +
                '\\d{3}' + // UN M.49
              ')' +
            ')?' + // region

            '(?:' +
              '(' + // [7] variants
                '(?:' +
                  '[_-]' +
                  '(?:' +
                    '[a-z\\d]{5,8}' +
                  '|' +
                    '\\d[a-z]{3}' +
                  ')' +
                ')+' +
              ')' +
            ')?' +

            '(?:' +
              '(' + // [8] extensions
                '(?:' +
                  '[_-]' +
                  '[a-wy-z]' + // extension indicator
                  '(?:[_-]\\w{2,8})+' + // extension
                ')+' +
              ')' +
            ')?' +

            '(?:' +
              '[_-]' +
              'x' + // private use indicator
              '(' + // [9] private use
                '(?:[_-]\\w{1,8})+' +
              ')' +
            ')?' +

          ')?' +

        '|' +

          'x' + // private use indicator
          '(' + // [10] private use
            '(?:' +
              '[_-]' +
              '\\w{1,8}' +
            ')+' +
          ')' +

        '|' +

          'i' + // grandfather indicator
          '[_-]' +
          '(\\w{2,8})' + // [11] grandfathered
        ')' +
      '$'
    ),
    VARIANT_REGEX = /-(\w)((?:[_-]\w{2,8})+)/g,
    SPLITTER = /[_-]/g;

  function carmen (text) {
    var
      tmp = text.match(LOCALE_REGEX),
      entry;

    if (tmp) {
      entry = {
        text: text
      };

      if (tmp[1] || tmp[3] || tmp[4]) {
        entry.language = tmp[1] || tmp[3] || tmp[4];
        if (tmp[2]) {
          entry.extlang = tmp[2].substr(1).split(SPLITTER);
        }
      }
      if (tmp[5]) {
        entry.script = tmp[5];
      }
      if (tmp[6]) {
        entry.region = tmp[6];
      }
      if (tmp[7]) {
        entry.variants = tmp[7].substr(1).split(SPLITTER);
      }
      if (tmp[8]) {
        entry.extensions = {};
        tmp[8].replace(VARIANT_REGEX, function (all, name, data) {
          entry.extensions[name] = data.substr(1).split(SPLITTER);
        });
      }
      if (tmp[9] || tmp[10]) {
        entry.private = (tmp[9] || tmp[10]).substr(1).split(SPLITTER);
      }
      if (tmp[11]) {
        entry.grandfather = tmp[11];
      }
    }

    return entry;
  }

  this.carmen = carmen;
}(this));


(function (exports) {
  var
    VERSION_REGEX = new RegExp(
      '^' +
        '(?:' +
          '(?![\\d_-]+$)' + // NOT alpha
          '([\\w-]+)' + // alpha
        '|' +
          '(\\d{8})' + // datestamp
        '|' +
          '(\\d+)' + // major
          '(?:' +
            '[._]' +
            '(\\d+)' + // minor
            '(?:' +
              '[._]' +
              '(\\d+)' + // patch
              '(?:' +
                '[._-]' +
                '(\\d+)' + // build
              ')?' +
            ')?' +
          ')?' +
          '(?:' +
            '[_-]?' +
            '([\\w].*)' + // tag
          ')?' +
        ')' +
      '$'
    );


  function parseVersion (text) {
    var
      matches = text.match(VERSION_REGEX),
      version = {};

    if (matches) {
      if (matches[1]) {
        version.alpha = matches[1];
      }
      if (matches[2]) {
        version.date = new Date(
          parseInt(matches[2].slice(0, 4), 10),
          parseInt(matches[2].slice(4, 6), 10),
          parseInt(matches[2].slice(6, 8), 10)
        );
      }
      if (matches[3]) {
        version.major = parseInt(matches[3], 10);
      }
      if (matches[4]) {
        version.minor = parseInt(matches[4], 10);
      }
      if (matches[5]) {
        version.patch = parseInt(matches[5], 10);
      }
      if (matches[6]) {
        version.build = parseInt(matches[6], 10);
      }
      if (matches[7]) {
        version.tag =   matches[7];
      }
    }
    return version;
  }

  this.parseVersion = parseVersion;
}(this));


(function (exports, carmen, parseVersion, undefined) {
  var
    IN_PARENS_EXTRACTOR = /\((?!like)(.*?)\)/g,
    IN_PARENS_SPLITTER = /;\s*/g,
    IN_PARENS_MATCHER = /(.+?)[/. ]?((?:\w+-)?\d+(?:[._-]?\w]*)*)?(?:,? like (.*?)\s*)?$/,
    OUT_PARENS_MATCHER = /([\w-]+)(?:\/(\S+))?(?:\s+\(like\s+(.*?)\))?/g,

    BROWSERS = /^applewebkit|camino|chrome|chromeframe|firefox|fluid|gecko|(?:ms)?ie|khtml|konqueror|mozilla|opera(?: mobi| mini)|presto|safari|trident$/i,
    OPERATING_SYSTEMS = /android|beos|blackberry|cri?os|kubuntu|(?:freebsd|linux|openbsd)(?: \w*)?|macintosh|mac_powerpc|(?:intel|ppc)? ?mac os x|sunos|symbos|ubuntu|win(?:dows )?(?:95|98|nt|ce)?/i;

  function tokenizeUserAgent (userAgent) {
    var
      tokens = [];

    userAgent
      .replace(IN_PARENS_EXTRACTOR, function (all, inParens) {
        var
          raw = inParens.split(IN_PARENS_SPLITTER),
          entry, tmp, i;

        for (i = 0; i < raw.length; i += 1) {
          tmp = raw[i].match(IN_PARENS_MATCHER);

          entry = {
            name: tmp[1]
          };

          if (tmp[2]) {
            entry.version = tmp[2];
          }

          if (tmp[3]) {
            entry.like = tmp[3];
          }

          tokens.push(entry);
        }

        return '';
      })
      .replace(OUT_PARENS_MATCHER, function (all, name, version, like) {
        var entry = {
          name: name
        };

        if (version) {
          entry.version = version;
        }

        if (like) {
          entry.like = like;
        }

        tokens.push(entry);
      });

    tokens.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      if (a.version.toLowerCase() < b.version.toLowerCase()) {
        return -1;
      } else if (a.version.toLowerCase() > b.version.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    return tokens;
  }

  function processTokens (tokens) {
    var result = [], i, entry, tmp;

    for (i = 0; i < tokens.length; i += 1) {
      tmp = carmen(tokens[i].name);

      if (tmp) {
        entry = tmp;
        entry.name = 'locale';
      } else if (tokens[i].name.match(/^[NUI]$/)) {
        entry = {
          name: 'security',
          text: tokens[i].name
        };
        switch (tokens[i].name) {
          case 'N': entry.value = 'none'; break;
          case 'U': entry.value = 'strong'; break;
          case 'I': entry.value = 'weak'; break;
        }
      } else {
        tmp = tokens[i];
        entry = {
          name: tmp.name
        };
        // TODO: test this
        if (tmp.version !== undefined) {
          entry.version = parseVersion(tmp.version);
        }
        if (tmp.like) {
          entry.like = tmp.like;
        }

        if (BROWSERS.test(tmp.name) || (tmp.like && BROWSERS.test(tmp.like))) {
          entry.type = 'browser';
        } else if (OPERATING_SYSTEMS.test(tmp.name) || (tmp.like && OPERATING_SYSTEMS.test(tmp.like))) {
          entry.type = 'os';
        }
      }

      result.push(entry);
    }

    return result;
  }

  function analyzeTokens (tokens) {
    // TODO
    return {};
  }

  function baskerville (userAgent) {
    var
      tokens = tokenizeUserAgent(userAgent),
      processedTokens = processTokens(tokens);

    return {
      rawTokens: tokens,
      processedTokens: processedTokens,
      analysis: analyzeTokens(processedTokens)
    };
  }

  baskerville._getTokenArray = tokenizeUserAgent;
  baskerville._getProcessedTokens = processTokens;
  baskerville._getAnalysis = analyzeTokens;

  this.baskerville = baskerville;
}(this, this.carmen, this.parseVersion));


(function (exports, baskerville) {
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

    if (/chrome\b|cri?os/i.test(userAgent)) {
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
      mobile: /android|iphone|ipad|ipod|blackberry/i.test(userAgent)
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
    version: '0.1.0',
    analyze: analyze,
    analyzeUserAgent: analyzeUserAgent,
    extractOS: extractOS,
    extractBrowser: extractBrowser,
    featureDetectBrowser: featureDetectBrowser
  };

  init();
}(this, this.baskerville));
