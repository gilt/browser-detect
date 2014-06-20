(function (exports, carmen, parseVersion, undefined) {
  var
    IN_PARENS_EXTRACTOR = new RegExp(
      '\\(' + // begin parens
        '(?!like)' + // ignore if it starts with "like", e.g. KHTML/4.4.3 (like Gecko)
        '(.*?)' + // extract this part
      '\\)', // end parens
      'g'
    ),
    IN_PARENS_SPLITTER = /;\s*/g,
    IN_PARENS_MATCHER = new RegExp(
      '(.+?)' + // lazily match anything, and save it -- this is the "name" field
      '[/. ]?' +
      '(' + // save the version
        '(?:\\w+-)?' + // versions can occasionally start with some text, e.g. ADR-1111101157, as long as that text is separated from the rest by a hyphen
        '\\d+' + // required to have at least 1 number
        '(?:[._-]?\\w)*' + // and a number of alphanumeric fields separated by a dot, underscore or hyphen
      ')?' + // yeah, version isn't actually required.
      '(?:,? like (.*?)\\s*)?$' // some tokens have a "like" comment, e.g. KHTML, like Gecko or CPU iPhone OS 2_0_1 like Mac OS X
    ),
    OUT_PARENS_MATCHER = new RegExp(
      '([\\w-]+)' + // here's our name field. unlike in parens, spaces are NOT allowed
      '(?:' +
        '/' + // name is separated from the version by a /
        '(\\S+)' + // our version field
      ')?' +
      '(?:\\s+\\(like\\s+(.*?)\\))?', // and the optional "like" comment
      'g'
    ),

    BROWSERS = /^applewebkit|camino|chrome|chromeframe|firefox|fluid|gecko|(?:ms)?ie|khtml|konqueror|mozilla|opera(?: mobi| mini)|presto|safari|trident$/i,
    OPERATING_SYSTEMS = /^android|beos|blackberry|cri?os|kubuntu|(?:freebsd|linux|openbsd)(?: \w*)?|macintosh|mac_powerpc|(?:intel|ppc)? ?mac os x|sunos|symbos|ubuntu|win(?:dows )?(?:95|98|nt|ce)?$/i;

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
