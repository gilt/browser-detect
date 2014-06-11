/*global __browserDetect: false*/
describe('Browser Detect', function () {
  var expected = [
    {
      userAgent: 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
      os: {
        name: 'windows',
        version: 6.1
      },
      browser: {
        name: 'ie',
        version: 10.6
      }
    },
    {
      userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Zune 4.0; Tablet PC 2.0; InfoPath.3; .NET4.0C; .NET4.0E)',
      os: {
        name: 'windows',
        version: 6.1
      },
      browser: {
        name: 'ie',
        version: 9.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)',
      os: {
        name: 'windows',
        version: 6.0
      },
      browser: {
        name: 'ie',
        version: 8.0
      }
    },
    {
      userAgent: 'Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.1; .NET CLR 1.0.3705; Media Center PC 3.1; Alexa Toolbar; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
      os: {
        name: 'windows',
        version: 5.1
      },
      browser: {
        name: 'ie',
        version: 7.0
      }
    },
    {
      userAgent: 'Mozilla/4.0 (compatible; U; MSIE 6.0; Windows NT 5.1) (Compatible; ; ; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)',
      os: {
        name: 'windows',
        version: 5.1
      },
      browser: {
        name: 'ie',
        version: 6.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25',
      os: {
        name: 'ios',
        version: 6.0
      },
      browser: {
        name: 'safari',
        version: 6.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1 Mobile/9B176 Safari/7534.48.3',
      os: {
        name: 'ios',
        version: 5.1
      },
      browser: {
        name: 'safari',
        version: 5.1
      }
    },
    {
      userAgent: 'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
      os: {
        name: 'ios',
        version: 4.3
      },
      browser: {
        name: 'safari',
        version: 5.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7',
      os: {
        name: 'ios',
        version: 4.1
      },
      browser: {
        name: 'safari',
        version: 4.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_0_1 like Mac OS X; fr-fr) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5G77 Safari/525.20',
      os: {
        name: 'ios',
        version: 2.0
      },
      browser: {
        name: 'safari',
        version: 3.1
      }
    },
    {
      userAgent: 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
      os: {
        name: 'android',
        version: 4.2
      },
      browser: {
        name: 'chrome',
        version: 18.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0',
      os: {
        name: 'windows',
        version: 5.1
      },
      browser: {
        name: 'firefox',
        version: 31.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0',
      os: {
        name: 'mac',
        version: 10.6
      },
      browser: {
        name: 'firefox',
        version: 25.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:21.0) Gecko/20100101 Firefox/21.0',
      os: {
        name: 'linux',
        version: NaN
      },
      browser: {
        name: 'firefox',
        version: 21.0
      }
    },
    {
      userAgent: 'Mozilla/5.0 (X11; CrOS i686 4319.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36',
      os: {
        name: undefined,
        version: NaN
      },
      browser: {
        name: 'chrome',
        version: 29.0
      }
    },
    {
      userAgent: 'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
      os: {
        name: 'windows',
        version: 6.0
      },
      browser: {
        name: 'opera',
        version: 12.14
      }
    },
    {
      userAgent: 'Opera/9.80 (S60; SymbOS; Opera Tablet/9174; U; en) Presto/2.7.81 Version/10.5',
      os: {
        name: undefined,
        version: NaN
      },
      browser: {
        name: 'opera',
        version: 10.5
      }
    },
    {
      userAgent: 'Mozilla/5.0 (compatible; Konqueror/4.4; Linux 2.6.32-22-generic; X11; en_US) KHTML/4.4.3 (like Gecko) Kubuntu',
      os: {
        name: 'linux',
        version: 2.6
      },
      browser: {
        name: undefined,
        version: NaN
      }
    }
  ];

  describe('extractOS', function () {
    expected.forEach(function (entry) {
      if (entry.os.name !== undefined) {
        it('should extract the name "' + entry.os.name + '" from "' + entry.userAgent + '"', function () {
          expect(__browserDetect.extractOS(entry.userAgent).name).toBe(entry.os.name);
        });
      }

      if (!isNaN(entry.os.version)) {
        it('should extract the version "' + entry.os.version + '" from "' + entry.userAgent + '"', function () {
          expect(__browserDetect.extractOS(entry.userAgent).version).toBe(entry.os.version);
        });
      }
    });
  });

  describe('extractBrowser', function () {
    expected.forEach(function (entry) {
      if (entry.browser.name !== undefined) {
        it('should extract the name "' + entry.browser.name + '" from "' + entry.userAgent + '"', function () {
          expect(__browserDetect.extractBrowser(entry.userAgent).name).toBe(entry.browser.name);
        });
      }

      if (!isNaN(entry.browser.version)) {
        it('should extract the version "' + entry.browser.version + '" from "' + entry.userAgent + '"', function () {
          expect(__browserDetect.extractBrowser(entry.userAgent).version).toBe(entry.browser.version);
        });
      }
    });
  });
});
