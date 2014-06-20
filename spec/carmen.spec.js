/*global carmen: false*/
describe('Carmen', function () {
  var
    expected = [
      {
        text: 'en',
        result: {
          text: 'en',
          language: 'en'
        }
      },
      {
        text: 'en_US',
        result: {
          text: 'en-US',
          language: 'en',
          region: 'US'
        }
      },
      {
        text: 'es-419',
        result: {
          text: 'es-419',
          language: 'es',
          region: '419'
        }
      },
      {
        text: 'zh-Hans',
        result: {
          text: 'zh-Hans',
          language: 'zh',
          script: 'Hans'
        }
      },
      {
        text: 'sl-rozaj-danlika',
        result: {
          text: 'sl-rozaj-danlika',
          language: 'sl',
          variants: ['rozaj', 'danlika']
        }
      },
      {
        text: 'sl-Latn-IT-nedis',
        result: {
          text: 'sl-Latn-IT-nedis',
          language: 'sl',
          script: 'Latn',
          region: 'IT',
          variants: ['nedis']
        }
      },
      {
        text: 'i-enochian',
        result: {
          text: 'i-enochian',
          grandfather: 'enochian'
        }
      },
      {
        text: 'x-foo',
        result: {
          text: 'x-foo',
          'private': ['foo']
        }
      },
      {
        text: 'de-CH-x-foo-bar-baz',
        result: {
          text: 'de-CH-x-foo-bar-baz',
          language: 'de',
          region: 'CH',
          'private': ['foo', 'bar', 'baz']
        }
      },
      {
        text: 'qaa-Qaaa-QM-x-southern',
        result: {
          text: 'qaa-Qaaa-QM-x-southern',
          language: 'qaa',
          script: 'Qaaa',
          region: 'QM',
          'private': ['southern']
        }
      },
      {
        text: 'en-abc-def-ghi',
        result: {
          text: 'en-abc-def-ghi',
          language: 'en',
          extlang: ['abc', 'def', 'ghi']
        }
      },
      {
        text: 'asdf',
        result: {
          text: 'asdf',
          language: 'asdf' // reserved for future use
        }
      },
      {
        text: 'abcde',
        result: {
          text: 'abcde',
          language: 'abcde' // registered language subtag
        }
      },
      {
        text: 'en-t-testing-ext-a-123',
        result: {
          text: 'en-t-testing-ext-a-123',
          language: 'en',
          extensions: {
            t: ['testing', 'ext'],
            a: ['123']
          }
        }
      }
    ];

  describe('locale parsing', function () {
    expected.forEach(function (entry) {
      it('should parse "' + entry.text + '"', function () {
        expect(carmen(entry.text)).toEqual(entry.result);
      });
    });
  });
});
