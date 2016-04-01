var model = {
  intervals: [{
    start: 450,
    end: 540,
    type: 'lesson'
  }, {
    start: 540,
    end: 555,
    type: 'break'
  }, {
    start: 555,
    end: 645,
    type: 'lesson'
  }, {
    start: 645,
    end: 660,
    type: 'break'
  }, {
    start: 660,
    end: 750,
    type: 'lesson'
  }, {
    start: 750,
    end: 765,
    type: 'break'
  }, {
    start: 765,
    end: 855,
    type: 'lesson'
  }, {
    start: 855,
    end: 870,
    type: 'break'
  }, {
    start: 870,
    end: 960,
    type: 'lesson'
  }, {
    start: 960,
    end: 975,
    type: 'break'
  }, {
    start: 975,
    end: 1065,
    type: 'lesson'
  }, {
    start: 1065,
    end: 1080,
    type: 'break'
  }, {
    start: 1080,
    end: 1170,
    type: 'lesson'
  }, {
    start: 1170,
    end: 1175,
    type: 'break'
  }, {
    start: 1175,
    end: 1265,
    type: 'lesson'
  }],
  timetable: {
    from: '04-04-2016',
    to: '10-04-2016',
    days: [{
      title: 'Poniedziałek',
      lessons: []
    }, {
      title: 'Wtorek',
      lessons: [{
        title: 'Systemy wbudowane',
        start: 555,
        end: 645,
        with: 'dr inż. Jerzy Bakalarczyk',
        room: 'F2',
        type: 'W'
      }, {
        title: 'Edycja i prezentacja danych',
        start: 660,
        end: 750,
        with: 'mgr inż. Hanna Tużylak',
        room: 'B-P6',
        type: 'L'
      }, {
        title: 'Systemy wbudowane',
        start: 870,
        end: 960,
        with: 'dr inż. Jerzy Bakalarczyk',
        room: 'B-P7',
        type: 'L'
      }, {
        title: 'Przedmiot branżowy',
        start: 1020,
        end: 1065,
        with: 'inż. Tomasz Wnuk',
        room: 'B-P6',
        type: 'L'
      }, {
        title: 'Przedmiot branżowy',
        start: 1080,
        end: 1170,
        with: 'inż. Tomasz Wnuk',
        room: 'B-P6',
        type: 'L'
      }]
    }, {
      title: 'Środa',
      lessons: []
    }, {
      title: 'Czwartek',
      lessons: [{
        title: 'Etyka',
        start: 765,
        end: 755,
        with: 'dr Daniel Żuromski',
        room: 'A2',
        type: 'W'
      }]
    }, {
      title: 'Piątek',
      lessons: [{
        title: 'Programowanie PLC',
        start: 555,
        end: 645,
        with: 'mgr inż. Tomasz Ocetkiewicz',
        room: 'B-P7',
        type: 'L'
      }, {
        title: 'Programowanie aplikacji na urządzenia mobilne (Java)',
        start: 660,
        end: 750,
        with: 'mgr inż. Tomasz Ocetkiewicz',
        room: 'B-P6',
        type: 'L'
      }, {
        title: 'Konsultacje dyplomowe',
        start: 765,
        end: 855,
        with: 'dr inż. Jacek Gospodarczyk',
        room: 'B-P6',
        type: 'C'
      }]
    }, {
      title: 'Sobota',
      lessons: []
    }, {
      title: 'Niedziela',
      lessons: []
    }]
  }
};

var timetableApp = angular.module('timetableApp', []);

timetableApp.controller('timetableCtrl', function($scope) {
  var dayStart = (60 * 7) + 30;
  var dayEnd = (60 * 21) + 5;
  var stepDuration = 5;
  var columnWidth = 250;
  $scope.cellHeight = 9;
  $scope.sliderOffset = 0;

  model.intervals.forEach(function(interval) {
    interval.height = ((interval.end - interval.start) / stepDuration) * $scope.cellHeight;
  });

  $scope.left = function() {
    $scope.sliderOffset += columnWidth;
  };

  $scope.right = function() {
    $scope.sliderOffset -= columnWidth;
  };

  $scope.timetable = {
    intervals: model.intervals,
    columns: []
  };

  String.prototype.paddingLeft = function(paddingValue) {
    return String(paddingValue + this).slice(-paddingValue.length);
  };

  $scope.getFormattedTime = function(time) {
    var hours = Math.floor(time / 60);
    var minutes = time - (hours * 60);
    hours = hours.toString().paddingLeft('00');
    minutes = minutes.toString().paddingLeft('00');
    return hours + '.' + minutes;
  };

  $scope.resolveColor = function(time) {
    for (var i = 0; i < model.intervals.length; i++) {
      var interval = model.intervals[i];
      if (time >= interval.start && time < interval.end) {
        return interval.type == 'lesson' ? '#C5CAE9' : '#E8EAF6';
      }
    }
  };

  model.timetable.days.forEach(function(day) {
    var pos = dayStart;
    var entries = [];
    day.lessons.forEach(function(lesson) {
      while (pos < lesson.end) {
        if (pos == lesson.start) {
          entries.push({
            title: lesson.title,
            type: lesson.type,
            start: lesson.start,
            end: lesson.end,
            height: ((lesson.end - lesson.start) / stepDuration) * $scope.cellHeight,
            with: lesson.with,
            room: lesson.room,
            color: $scope.resolveColor(pos)
          });
        } else {
          entries.push({
            title: null,
            height: $scope.cellHeight,
            color: $scope.resolveColor(pos)
          });
        }
        pos += stepDuration;
      }
    });
    while (pos < dayEnd) {
      entries.push({
        title: null,
        height: $scope.cellHeight,
        color: $scope.resolveColor(pos)
      });
      pos += stepDuration;
    }
    $scope.timetable.columns.push({
      header: day.title,
      width: columnWidth,
      entries: entries
    });
  });
});
