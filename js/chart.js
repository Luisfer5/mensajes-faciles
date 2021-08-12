
//Create instance for chart
export const createChart = () => {

    if (JSON.parse(localStorage.getItem('Info'))) {

        let [arraygroupedDayhours,lastDaygrouped] = chart();

        var data = []

        for (const item of arraygroupedDayhours) {

            data.push({ label: `${item.key}:00`, value: `${item.cantidad}` })
        }

        var options = {
            element: 'chart_donut',
            data: data,
            resize: true,
        }


        const bar = Morris.Bar({
            element: 'chart_donut',
            data: data,
            xkey: 'label',
            ykeys: ['value'],
            labels: ['Cantidad'],
            resize: true,
            fillOpacity: 0.6,
            barColors: ['#5e2590'],
            hideHover: 'auto',
            behaveLikeLine: true,
            resize: true,
        });
        // const bar = Morris.Bar(options);
        const dataLastDay =[{label:Object.keys(lastDaygrouped)[0],value:lastDaygrouped[Object.keys(lastDaygrouped)[0]].length}]

        const donut = Morris.Donut({
            element: 'chart_donut2',
            data:  dataLastDay,           // data:[{label : 'label testing ',value: 50}],
            xkey: 'label',
            ykeys: ['value'],
            labels: ['Cantidad'],
            resize: true,
            fillOpacity: 0.6,
            barColors: ['#5e2590'],
            hideHover: 'auto',
            behaveLikeLine: true,
            resize: true,
        });

        const linia = Morris.Line({
            element: 'myfirstchart',
            data: data,
            xkey: 'label',
            ykeys: ['value'],
            labels: ['Cantidad'],
            resize: true,
            fillOpacity: 0.6,
            hideHover: 'auto',
            behaveLikeLine: true,
            resize: true,
            pointFillColors: ['#000'],
            pointStrokeColors: ['orange'],
            lineColors: ['gray', 'red'],

        });


        bar.setData(data)

        return [bar, linia,donut];
    }

    return [null, null , null];
}


//Create GroupedHours array for the last day
export function chart() {

    let historial = JSON.parse(localStorage.getItem('Info'));

    if (historial) {
        let groupedDataLastDay = {};
        let groupedDayhours = {};

        let lastdateShortFormat = JSON.parse(localStorage.getItem('Info'))[0].fecha.slice(0, 10).trim() // aaaa-mm-dd

        //data grouped for last day
        for (const { fecha, ...resto } of historial) {

            if (fecha.slice(0, 10).trim() === lastdateShortFormat) {
                groupedDataLastDay[lastdateShortFormat] = [...groupedDataLastDay[lastdateShortFormat] || [], fecha];

            }
        }

        //data grouped for hours in the last day
        for (const hour of groupedDataLastDay[lastdateShortFormat]) {

            let key = hour.slice(0, 13) //key in format aaaa-mm-dd HH
            groupedDayhours[key] = [...groupedDayhours[key] || [], hour]
        }

        let arrayGroupeedDayHours = [];

        for (const key of Object.keys(groupedDayhours)) {
            // console.log(`la hora : ${key} tiene ${groupedDayhours[key].length}`)
            arrayGroupeedDayHours.push({ "key": key, "cantidad": groupedDayhours[key].length })
        }

        return [arrayGroupeedDayHours,groupedDataLastDay];
    } else {
        return [{ "key": 0, "cantidad": 0 }]
    }
}

export const valor = () => console.log('object');
