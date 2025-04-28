javascript:
        if (document.URL.match("mode=incomings&subtype=attacks")) {
                $("#incomings_table").find("tr").eq(0).find("th").last().after('<th>Watchtower</th>');
                var url = "https://" + location.host + game_data.link_base_pure + "overview_villages&mode=buildings&group=0&page=-1",
                        url2 = "https://" + location.host + "/interface.php?func=get_unit_info",
                        towerCoords = [],
                        towerLevels = [],
                        unitSpeed = [],
                        intersectionPoints = [],
                        block = [],
                        timesRun = 1,
                        //grab incoming number in parentheses at top of table
                        rows = Number($("#incomings_table").find("th").first().text().split(" ")[1].replace("(", "").replace(")", ""));
 
 
                function first() {
                        $.ajax({
                                url: url2,
                                async: false,
                                success: function(data) {
                                        $.each(["sword", "axe", "spy", "light", "heavy", "ram", "snob"], function(key, val) {
                                                // extract unit speeds
                                                unitSpeed.push(Number($(data).find("config > " + val + " > speed").text()) * 60);
                                        })
                                        $.ajax({
                                                url: url,
                                                async: false,
                                                success: function(datas) {
                                                        $(datas).find("#villages").find("tr").each(function(key, val) {
                                                                if (Number($(val).find(".upgrade_building.b_watchtower").text()) > 0) {
                                                                        // extract coordinates and levels of watchtowers
                                                                        towerCoords.push($(val).find(".quickedit-label").text().match(/\d+\|\d+/)[0]);
                                                                        // radius of watchtower
                                                                        var level = Number($(val).find(".upgrade_building.b_watchtower").text());
                                                                        switch (level) {
                                                                                case 1:
                                                                                        towerLevels.push(1.1);
                                                                                        break;
                                                                                case 2:
                                                                                        towerLevels.push(1.3);
                                                                                        break;
                                                                                case 3:
                                                                                        towerLevels.push(1.5);
                                                                                        break;
                                                                                case 4:
                                                                                        towerLevels.push(1.7);
                                                                                        break;
                                                                                case 5:
                                                                                        towerLevels.push(2);
                                                                                        break;
                                                                                case 6:
                                                                                        towerLevels.push(2.3);
                                                                                        break;
                                                                                case 7:
                                                                                        towerLevels.push(2.6);
                                                                                        break;
                                                                                case 8:
                                                                                        towerLevels.push(3);
                                                                                        break;
                                                                                case 9:
                                                                                        towerLevels.push(3.4);
                                                                                        break;
                                                                                case 10:
                                                                                        towerLevels.push(3.9);
                                                                                        break;
                                                                                case 11:
                                                                                        towerLevels.push(4.4);
                                                                                        break;
                                                                                case 12:
                                                                                        towerLevels.push(5.1);
                                                                                        break;
                                                                                case 13:
                                                                                        towerLevels.push(5.8);
                                                                                        break;
                                                                                case 14:
                                                                                        towerLevels.push(6.7);
                                                                                        break;
                                                                                case 15:
                                                                                        towerLevels.push(7.6);
                                                                                        break;
                                                                                case 16:
                                                                                        towerLevels.push(8.7);
                                                                                        break;
                                                                                case 17:
                                                                                        towerLevels.push(10);
                                                                                        break;
                                                                                case 18:
                                                                                        towerLevels.push(11.5);
                                                                                        break;
                                                                                case 19:
                                                                                        towerLevels.push(13.1);
                                                                                        break;
                                                                                case 20:
                                                                                        towerLevels.push(15);
                                                                                        break;
                                                                        }
                                                                }
                                                        })
                                                        if (towerCoords.length == 0) {
                                                                UI.ErrorMessage("There are no watchtowers in any of your villages!", 5000)
                                                        }
                                                },
                                        })
                                },
                        })
                }
                var doStuff = function() {
                       
                        //$.ajax({
                        //        url: url,
                        //        success: function() {
                                        intersectionPoints = [];
                                        block = [];
                                        // add a row to the table
                                        $("#incomings_table").find("tr").eq(timesRun).find("td").last().after("<td></td>");
                                        // get distance between origin and destination
                                        var distance = Number($("#incomings_table").find("tr").eq(timesRun).find("td").eq(4).text().trim());
                                        // get coordinates of origin and destination
                                        var destination = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(1).text().match(/\d+\|\d+/)[0];
                                        var origin = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(2).text().match(/\d+\|\d+/)[0];
                                        // get arrival time and convert to seconds
                                        var hms = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(6).text().split(':'),
                                                seconds = (+hms[0]) * 3600 + (+hms[1]) * 60 + (+hms[2]),
                                                // extract command name
                                                commandName = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(0).text().trim().toLowerCase();
                                        // convert arrival time to field (?)
                                       
                                        //console.log(commandName);
                                        if (commandName.includes("sword")) {
                                                var remainingFields = seconds / unitSpeed[0];
                                        } else if (commandName.includes("axe") || commandName.includes("spear") || commandName.includes("machado")) {
                                                var remainingFields = seconds / unitSpeed[1];
                                        } else if (commandName.includes("spy") || commandName.includes("scout") || commandName.includes("btd")) {
                                                var remainingFields = seconds / unitSpeed[2];
                                        } else if (commandName.includes("lcav") || commandName.includes("light")) {
                                                var remainingFields = seconds / unitSpeed[3];
                                        } else if (commandName.includes("hcav") || commandName.includes("heavy")) {
                                                var remainingFields = seconds / unitSpeed[4];
                                        } else if (commandName.includes("ram") || commandName.includes("cat") || commandName.includes("aríete")) {
                                                var remainingFields = seconds / unitSpeed[5];
                                        } else if (commandName.includes("noble") || commandName.includes("snob") || commandName.includes("nobre")) {
                                                var remainingFields = seconds / unitSpeed[6];
                                        }
                                        //console.log(hatralevo_mezo);
                                        // the slope of the line is m = (y1-y2) / (x1-x2), if the divisor is zero, then the divisor should be equal to 1
                                        var target = String(destination).split("|");
                                        var source = String(origin).split("|");
                                        var divisor = Number(target[0]) - Number(source[0]);
                                        if (divisor == 0) {
                                                divisor = 1;
                                        }
                                        var m = (Number(target[1]) - Number(source[1])) / (divisor);
                                        // where the line intersects the y axis y1 = mx1 + b
                                        var n = (m * Number(target[0]) - Number(target[1])) / -1;
                                        for (var i = 0; i < towerCoords.length; i++) {
                                                var h = (String(towerCoords[i]).split("|"))[0];
                                                var k = (String(towerCoords[i]).split("|"))[1];
                                                var r = towerLevels[i];
                                                findCircleLineIntersections(r, h, k, m, n);
                                        }
 
                                        function findCircleLineIntersections(r, h, k, m, n) {
                                                // circle: (x - h)^2 + (y - k)^2 = r^2
                                                // line: y = m * x + n
                                                // r: circle radius
                                                // h: circle x coords
                                                // k: circle y coords
                                                // m: line slope
                                                // n: y-intercept
                                                // a, b, c is (?)
                                                var a = 1 + Math.pow(m, 2);
                                                var b = -h * 2 + (m * (n - k)) * 2;
                                                var c = Math.pow(h, 2) + Math.pow(n - k, 2) - Math.pow(r, 2);
                                                // discriminatory value (?)
                                                var d = Math.pow(b, 2) - 4 * a * c;
                                                if (d >= 0) {
                                                        // quadratic formula
                                                        var intersections = [
                                                                (-b + Math.sqrt(d)) / 2 / a,
                                                                (-b - Math.sqrt(d)) / 2 / a
                                                        ];
                                                        if (d == 0) {
                                                                // the tangent of the line to the circle (a common point) (?)
                                                                intersectionPoints.push((Number(intersections[0])) + "|" + (Number(m * intersections[0] + n)));
                                                        }
                                                        // the line intersects the outline (two common points) (?)
                                                        intersectionPoints.push((Number(intersections[0])) + "|" + (Number(m * intersections[0] + n)));
                                                        intersectionPoints.push((Number(intersections[1])) + "|" + (Number(m * intersections[1] + n)));
                                                }
                                                // nothing in common (?)
                                        }
                                        //console.log(intersectionPoints.length);
                                        // if no common point
                                        if (intersectionPoints.length == 0) {
                                                $("#incomings_table").find("tr").eq(timesRun).find("td").last().text("Undetectable").css({
                                                        "font-weight": "bold",
                                                        "color": "red"
                                                });
                                                ++timesRun
                                                setTimeout(doStuff, 1);
                                        }
                                        // intersection closest to origin village on circle
                                        for (var i = 0; i < intersectionPoints.length; i++) {
                                                var intersections = intersectionPoints[i].split("|");
                                                // for each intersection, calculate distance to origin village
                                                var originDistance = Math.sqrt((Math.pow((intersections[0] - source[0]), 2) + Math.pow((intersections[1] - source[1]), 2)));
                                                block.push(originDistance);
                                        }
                                        //console.log(block);
                                        // find index of shortest distance
                                        idx = block.indexOf(Math.min.apply(null, block));
                                        //console.log(idx);
                                        // with the index we get, which is the closest intersection point to the village of origin (?)
                                        var nearest = intersectionPoints[idx];
                                        //console.log(nearest);
                                        // where we are going, i.e. (full distance - remaining field)
                                        var currentDistance = distance - remainingFields;
                                        // (from the distance of the village of origin and the nearest intersection point on the circle) we subtract the (where we go) (?)
                                        // so we get how many squares the attack is from the intersection of the circle and then we convert this to seconds (multiply by the unit speed)
                                        var M = nearest.split("|");
                                        var remaining = Math.sqrt((Math.pow((M[0] - source[0]), 2) + Math.pow((M[1] - source[1]), 2))) - currentDistance;
                                        //console.log(remaining);
                                        if (commandName.includes("sword")) {
                                                var sec = remaining * unitSpeed[0];
                                        } else if (commandName.includes("axe") || commandName.includes("spear")) || commandName.includes("machado") {
                                                var sec = remaining * unitSpeed[1];
                                        } else if (commandName.includes("spy") || commandName.includes("scout")) || commandName.includes("btd") {
                                                var sec = remaining * unitSpeed[2];
                                        } else if (commandName.includes("lcav") || commandName.includes("light")) {
                                                var sec = remaining * unitSpeed[3];
                                        } else if (commandName.includes("hcav") || commandName.includes("heavy")) {
                                                var sec = remaining * unitSpeed[4];
                                        } else if (commandName.includes("ram") || commandName.includes("cat") || commandName.includes("aríete")) {
                                                var sec = remaining * unitSpeed[5];
                                        } else if (commandName.includes("noble") || commandName.includes("snob")) || commandName.includes("nobre")) {
                                                var sec = remaining * unitSpeed[6];
                                        }
                                        // count down in seconds
                                        var myTimer;
 
                                        function clock(x) {
                                                myTimer = setInterval(myClock, 1000);
 
                                                function myClock() {
                                                        --sec
                                                        var seconds = Math.floor(sec % 60);
                                                        var minutes = Math.floor((sec / 60) % 60);
                                                        var hours = Math.floor((sec / (60 * 60)));
                                                        // if the number is less than 10, you enter 0
                                                        seconds = seconds < 10 ? "0" + seconds : seconds;
                                                        minutes = minutes < 10 ? "0" + minutes : minutes;
                                                        hours = hours < 10 ? "0" + hours : hours;
                                                        time = hours + ":" + minutes + ":" + seconds;
                                                        // add time to table
                                                        if (sec < 0) {
                                                                // hif the attack is within range, the sec is negative
                                                                var time = "Detected";
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(time).css({
                                                                        "font-weight": "bold",
                                                                        "color": "green"
                                                                });
                                                        } else {
                                                                var time = hours + ":" + minutes + ":" + seconds;
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(time).css("font-weight", "bold");
                                                        }
                                                        if (sec == 0) {
                                                                clearInterval(myTimer);
                                                        }
                                                }
                                        }
                                        clock(timesRun);
                                        //console.log(towerCoords);
                                        //console.log(towerLevels);
                                        //console.log(distance);
                                        //console.log(destination);
                                        //console.log(origin);
                                        //console.log(unitSpeed);
                                        //console.log(remainingFields);
                                        //console.log(m);
                                        //console.log(n);
                                        //console.log(h);
                                        //console.log(k);
                                        //console.log(intersectionPoints);
                                        //console.log(sec);
                                        if (++timesRun < rows + 1) {
                                                doStuff();
                                        }
                                //},
                        //})
                }
                $.ajax({url: url, success: function() {
                        $.ajax({
                                url: first(),
                                success: function() {
                                        doStuff();
                                }
                        })
                        }
                });
               
        } else {
                self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=overview_villages&mode=incomings&subtype=attacks");
        }
void(0);
