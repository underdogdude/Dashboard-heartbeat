    // Create the chart
    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: 'Frequency : '
        },
        chart: {
            style: {
                fontFamily: 'Raleway'
            }
        }
    });
    
    Highcharts.stockChart('battPercentGraph', {
        chart:{
             spacingTop: 30,
             
        },
        rangeSelector: {
           buttonPosition:{
                y:0,
            },
            selected: 1,
            inputEnabled: false,
            allButtonsEnabled: true,
        },
        yAxis:{
            min:0,
            max : 100,
            opposite:false,
            showLastLabel: true,
            plotLines: [{
                value: 50,
                width: 1.5,
                dashStyle: 'dash',
                color: '#2ABB9B',
                zIndex:5
            }],
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Percentage',
            data: [12,31,4,34,25,43,33,100,100,93,92,1],
            type: 'areaspline',
            threshold: null,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
    });

    let graph_digit = {
        chart:{
             spacingTop: 30,
             
        },
        rangeSelector: {
           buttonPosition:{
                y:0,
            },
            selected: 1,
            inputEnabled: false,
            allButtonsEnabled: true,
        },
        yAxis:{
            opposite:false,
            min:-1,
            max:1,
            tickInterval: 1,
            showLastLabel: true, // show number1
            labels: {
                formatter: function () {
                    if(this.value === 1){
                        return 'Active'
                    }else if(this.value === 0){
                        return 'Break'
                    }else{
                        return 'Background';
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'AAPL Stock Price',
            data: [0,1,-1,-1,0,0,1,1,1,1,0,1,-1,1,0,1,0,1,-1],
            step:true
        }]
    };

    let graph = {
        chart:{
             spacingTop: 30,
             
        },
        rangeSelector: {
           buttonPosition:{
                y:0,
            },
            selected: 1,
            inputEnabled: false,
            allButtonsEnabled: true,
        },
        yAxis:{
            min:0,
            showLastLabel: true,
            opposite:false,
            plotLines: [{
                value: 37,
                width: 1.5,
                dashStyle: 'dash',
                color: '#2ABB9B',
                zIndex:5
            }],
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Temperature',
            data: [39,31,28,34,25,38,33,38,37,38,38,28],
            type: 'areaspline',
            threshold: null,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }]
    };
    let dup1 = JSON.parse(JSON.stringify(graph));
    let dup2 = JSON.parse(JSON.stringify(graph));
    let dup3 = JSON.parse(JSON.stringify(graph_digit));
    let dup4 = JSON.parse(JSON.stringify(graph_digit));

    Highcharts.stockChart('battTempGraph', graph);
    Highcharts.stockChart('storageGraph', dup1);
    Highcharts.stockChart('memoryGraph', dup2);
    Highcharts.stockChart('applicationGraph', graph_digit);
    Highcharts.stockChart('pageCurrentGraph', dup3);
    Highcharts.stockChart('battHealthGraph', dup4);


    let main_data = {};
    let elem_body = document.getElementById('table');
    let elem_card = document.querySelectorAll('.data');
    let elem_progress = document.querySelectorAll('.data-storage');

    let clpse_elem = document.querySelectorAll('.collapse');
    let clpse_elem_active = document.querySelectorAll('.card-panel');
    let clpse_elem_icon = document.querySelectorAll('.card-showmore-btn');

    let show_state = 0;
    let collect_detail, collect_rom, collect_ram, collect_id;

    let fetch = {
        api: function () {
            let time = moment().format('llll');
            $('#clock').html('Last Update : ' + time);
            elem_body.innerHTML = '';
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/hb/devices",
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8'
                },
                processData: false
            }).done(function (response) {
                main_data = response.data;
                create.table(function () {
                    if (show_state === 1) {
                        collect.data(collect_detail, collect_rom, collect_ram, collect_id);
                        let click_elem = document.getElementById(collect_id);
                        click_elem.click();
                    }
                });
            })

            let delay = new Date().getTime() % 60000;
            setTimeout(fetch.api, 300000 - delay); //300000 is five minute
        },
        graph(id){
            let enddate = moment().unix() * 1000;
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/hb/graph?client_device="+id+'&startdate=0&enddate='+enddate,
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8'
                },
                processData: false
            }).done(function (response) {
                console.log(response);
            })
        }
    }
    let collect = {

        data: function (detail, rom, ram, id) { // id of element is device id too

            collect_id = id;
            view.detail(detail, id);
            view.memory(rom, ram);
            fetch.graph(id);
            
        }
    }

    let view = {

        detail: function (row) {

            show_state = 1; // check state
            collect_detail = row;
            let length = row.length;
            for (let i = 0; i < length; i++) {
                if (typeof row[i] === 'undefined') {
                    elem_card[i].innerHTML = 'N/A';
                } else {
                    elem_card[i].innerHTML = row[i];
                }
            }
            $('#display_Section').show();
            $('html, body').animate({
                scrollTop: $('#display_Section').offset().top - 50
            }, 'slow');
        },
        // 1048576
        memory: function (rom, ram) {

            collect_rom = rom;
            collect_ram = ram;

            let rom_free_storage, rom_full_storage, ram_free_memory, ram_full_memory;
            let percent_rom, percent_ram;
            let cal = 1073741824;
            if (typeof rom.free_storage !== 'undefined') {
                rom_free_storage = (rom.free_storage / cal).toFixed(2)
            } else {
                rom_free_storage = 'N/A'
            }
            if (typeof rom.full_storage !== 'undefined') {
                rom_full_storage = (rom.full_storage / cal).toFixed(2)
            } else {
                rom_full_storage = 'N/A'
            }
            if (typeof ram.free_memory !== 'undefined') {
                ram_free_memory = (ram.free_memory / cal).toFixed(2)
            } else {
                ram_free_memory = 'N/A'
            }
            if (typeof ram.full_memory !== 'undefined') {
                ram_full_memory = (ram.full_memory / cal).toFixed(2)
            } else {
                ram_full_memory = 'N/A'
            }

            let rom_used = (rom_full_storage - rom_free_storage).toFixed(2);
            let ram_used = (ram_full_memory - ram_free_memory).toFixed(2);
            percent_rom = ((rom_used / rom_full_storage) * 100).toFixed(2);
            percent_ram = ((ram_used / ram_full_memory) * 100).toFixed(2);

            if (isNaN(percent_rom) || percent_rom < 0) {
                percent_rom = 'N/A'
            }
            if (isNaN(percent_ram) || percent_ram < 0) {
                percent_ram = 'N/A'
            }
            if (isNaN(rom_used) || rom_used < 0) {
                rom_used = 'N/A'
            }
            if (isNaN(ram_used) || ram_used < 0) {
                ram_used = 'N/A'
            }

            elem_progress[0].innerHTML = `
                            <i class="fa fa-hdd-o icon-card pull-right" aria-hidden="true"></i>
                            <h5 class="font"><strong>Storage</strong></h5>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="` + percent_rom + `"
                                aria-valuemin="0" aria-valuemax="100" style="width:` + percent_rom + `%">
                                    <span class="progress-value">` + percent_rom + ` %</span>
                                </div>
                            </div>
                            <div>
                                <span class="text-left">` + rom_used + ` GB</span>
                                <span class="pull-right">` + rom_full_storage + ` GB</span>
                            </div>`;
            elem_progress[1].innerHTML = `
                            <i class="fa fa-floppy-o icon-card pull-right" aria-hidden="true"></i>
                            <h5 class="font"><strong>Memory</strong></h5>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="` + percent_ram + `"
                                aria-valuemin="0" aria-valuemax="100" style="width:` + percent_ram + `%">
                                    <span class="progress-value">` + percent_ram + ` %</span>
                                </div>
                            </div>
                            <div>
                                <span class="text-left">` + ram_used + ` GB</span>
                                <span class="pull-right">` + ram_full_memory + ` GB</span>
                            </div>`;
        },


        toggleDiv: function (idName) {

            let id_elem = document.getElementById(idName);
            let clpse_elem_length = clpse_elem.length;

            for (let i = 0; i < clpse_elem_length; i++) {
                if (clpse_elem[i].id !== idName) {
                    $(clpse_elem_icon[i]).removeClass("fa-angle-double-down");
                    $(clpse_elem[i]).removeClass("in");
                    // $(clpse_elem_active[i]).toggleClass("card-inactive");
                } else {
                    $(clpse_elem_icon[i]).toggleClass("fa-angle-double-down");
                }
            }

            if (!$(id_elem).hasClass("in")) { // check for animate
                setTimeout(function () {
                    $('html, body').animate({
                        scrollTop: $(id_elem).offset().top - 50
                    }, 'slow');
                }, 10);
            }
        }
    }

    let create = {

        table: function (callback) {

            elem_body.innerHTML = ''; // clear table again for make sure

            let arr_table = [];
            for (let i in main_data) {
                if (main_data[i] !== undefined && typeof main_data[i] === 'object') {
                    if (main_data[i].tags !== undefined) { // check case undefined tags
                        for (let tag in main_data[i].tags) { // loop in tags

                            let existTable = arr_table.indexOf(tag);
                            if (existTable !== -1) { //table already exist

                                create.rowTable(tag, main_data[i], main_data[i].tags[tag], i);
                            } else {

                                let tbody = document.createElement('TBODY');
                                tbody.id = tag;
                                create.headTable(tag);
                                create.rowTable(tag, main_data[i], main_data[i].tags[tag], i);
                                arr_table.push(tag);
                            }
                        }
                    } else {
                        let existTable = arr_table.indexOf('N/A');
                        if (existTable !== -1) { //table already exist
                            create.rowTable('N/A', main_data[i], 'N/A', i);
                        } else {

                            let tbody = document.createElement('TBODY');
                            tbody.id = 'N/A';
                            create.headTable('N/A');
                            create.rowTable('N/A', main_data[i], 'N/A', i);
                            arr_table.push('N/A');
                        }
                    }
                }
            }
            callback();
        },
        headTable: function (tag) {

            let thead = document.createElement('THEAD');
            let tbody = document.createElement('TBODY');
            tbody.id = tag;
            thead.innerHTML = `<tr class="row-header">
                                <th>` + tag + `</th>
                                <th>Application</th>
                                <th>Battery</th>
                                <th>Storage</th>
                                <th>Memory</th>
                                <th>Last Update</th>
                            </tr>`;
            elem_body.appendChild(thead);
            elem_body.appendChild(tbody)
        },
        rowTable: function (tag, data, name, id) {

            let last_modify = moment.unix(data.timestamp/1000).format('llll');
            if(last_modify === 'Invalid date'){
                last_modify = '-';
            }
            let tbody = document.getElementById(tag);
            let tr = document.createElement('TR');
            tr.id = id;
            tr.setAttribute("data-toggle", "tooltip");
            tr.setAttribute("title", "Click to show more detail");
            tr.setAttribute("data-placement", "right");
            tr.addEventListener("click", function () {
                collect.data([name, data.application.status, data.app_version, data.application.status, data.battery.percent, data.battery.health, data.battery.temperature, data.application.page_display], data.rom, data.ram, id)
            });

            tr.innerHTML +=
                `<td>` + name + `</td>
                    <td><div class="circle ` + create.color(data.application.status_color) + `"></div></td>
                    <td><div class="circle ` + create.color(data.battery.status_color) + `"></div></td>
                    <td><div class="circle ` + create.color(data.rom.status_color) + `"></div></td>
                    <td><div class="circle ` + create.color(data.ram.status_color) + `"></div></td>
                    <td><i>` + last_modify + `</i></td>`;

            tbody.appendChild(tr);
            $('[data-toggle="tooltip"]').tooltip();
        },

        color: function (type) {

            if (type === 'GREEN') {
                return 'circle-online';
            } else if (type === 'YELLOW') {
                return 'circle-warning';
            } else if (type === 'RED') {
                return 'circle-offline';
            } else {
                return 'circle-unknown';
            }
        }
    }


    fetch.api();