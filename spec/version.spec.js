/*global parseVersion: false*/
describe('Version', function () {
  var
    expected = [
      {
        text: '1',
        major: 1
      },
      {
        text: '1.2',
        major: 1,
        minor: 2
      },
      {
        text: '1.2.3',
        major: 1,
        minor: 2,
        patch: 3
      },
      {
        text: '1_2_3',
        major: 1,
        minor: 2,
        patch: 3
      },
      {
        text: '1.2.3-4',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4
      },
      {
        text: '1.2.3.4',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4
      },
      {
        text: '1.2.3a',
        major: 1,
        minor: 2,
        patch: 3,
        tag: 'a'
      },
      {
        text: '1.2.3-a',
        major: 1,
        minor: 2,
        patch: 3,
        tag: 'a'
      },
      {
        text: '1.2.3_a',
        major: 1,
        minor: 2,
        patch: 3,
        tag: 'a'
      },
      {
        text: '1.2.3-4a',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        tag: 'a'
      },
      {
        text: '1.2.3-4-a',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        tag: 'a'
      },
      {
        text: '1.2.3-4_a',
        major: 1,
        minor: 2,
        patch: 3,
        build: 4,
        tag: 'a'
      },
      {
        text: '1a4',
        alpha: '1a4'
      },
      {
        text: '20140617',
        date: new Date(2014, 6, 17)
      },
      {
        text: 'ADR-1111101157',
        alpha: 'ADR-1111101157'
      }
    ];


  function eq (a, b) {
    if (b !== undefined) {
      if (typeof(b) !== 'string' && isNaN(b)) {
        expect(a).toBeNaN();
      } else {
        expect(a).toEqual(b);
      }
    }
  }

  describe('parsing', function () {
    expected.forEach(function (entry) {
      it('should parse "' + entry.text + '"', function () {
        var v = parseVersion(entry.text);
        eq(v.major, entry.major);
        eq(v.minor, entry.minor);
        eq(v.patch, entry.patch);
        eq(v.build, entry.build);
        eq(v.tag,   entry.tag);
        eq(v.alpha, entry.alpha);
        eq(v.date,  entry.date);
      });
    });
  });
});
