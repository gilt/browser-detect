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
