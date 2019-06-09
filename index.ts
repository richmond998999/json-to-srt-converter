import * as fs from 'fs';
import * as yargs from 'yargs';

const argv = yargs
    .usage("Usage: $0[options]")
    .options({
        file : {
            demand : true,
            alias : 'f',
            description : 'Load a file'
        }
    })
    .argv
;

function convertMS( value: number ) {
    let day, hour, minute, seconds, milliseconds;
    seconds = Math.floor(value / 1000);
    milliseconds = value % 1000;
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day.toString().padStart(2, '0'),
        hour: hour.toString().padStart(2, '0'),
        minute: minute.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: milliseconds.toString().padStart(3, '0')
    };
}

function convert(file: Array<any>) {
    let output = '';

    file.forEach(element => {
        const start = convertMS(element.start);
        const end = convertMS(element.end);

        const startTime = `${start.hour}:${start.minute}:${start.seconds},${start.milliseconds}`
        const endTime = `${end.hour}:${end.minute}:${end.seconds},${end.milliseconds}`

        let slice = `${element.index}\n${startTime} --> ${endTime}\n`
        element.text.forEach(text => {
            slice = slice + `${text}\n`
        });
        output = output  + slice + '\n';
    });

    return output;
}

function run() {
    const fileRead = fs.readFileSync(argv.file, 'utf8');
    const output = convert(JSON.parse(fileRead))
    fs.writeFileSync(argv.file + '.srt', output, 'utf8');
}

run();