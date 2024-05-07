/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { useEpg, Epg, Layout, Program } from 'planby';
import { eventsData, EventData } from './EventData';  // Import your event data

// Define the type for the date ranges
type DateRangeKey = '2024-05-17' | '2024-05-18' | '2024-05-19';
type DateRanges = Record<DateRangeKey, { start: Date; end: Date }>;


export const SchedulePage: React.FC = () => {
    const channels = useMemo(() => [{
        logo: ' ',
        uuid: 'universal-channel', 
    }], []);
    
    const planbyTheme = {
    primary: {
        600: '#ffffff', 
        900: '#ffffff', 
    },
    grey: {
        300: '#fafafa',
        500: '#cccccc', 
    },
    white: '#4caf50', 
    green: {
        300: '#4caf50', 
    },
    loader: {
        teal: '#80cbc4',
        purple: '#ce93d8',
        pink: '#f48fb1',
        bg: '#ffffff',
    },
    scrollbar: {
        border: '#dddddd',
        thumb: {
            bg: '#cccccc',
        },
    },
    gradient: {
        blue: {
            300: '#e3f2fd', 
            600: '#90caf9', 
            900: '#42a5f5', 
        },
    },
    text: {
        grey: {
            300: '#222222',
            500: '#333333',
        },
    },
    timeline: {
        divider: {
            bg: '#bdbdbd', 
        },
    },
};
      
    const dateRanges: DateRanges = {
        '2024-05-17': { start: new Date('2024-05-17T00:00:00'), end: new Date('2024-05-17T23:59:59') },
        '2024-05-18': { start: new Date('2024-05-18T00:00:00'), end: new Date('2024-05-18T23:59:59') },
        '2024-05-19': { start: new Date('2024-05-19T00:00:00'), end: new Date('2024-05-19T23:59:59') },
    };

    const [selectedDay, setSelectedDay] = useState<DateRangeKey>('2024-05-17');


    const filteredEpg = useMemo(() => eventsData.filter(event =>
        event.date >= dateRanges[selectedDay].start && event.date <= dateRanges[selectedDay].end
    ).map((event): Program => ({
        channelUuid: 'universal-channel',
        id: event.title.replace(/\s+/g, '-'),
        title: event.title,
        description: event.description,
        image: '',
        since: event.date.toISOString(),
        till: new Date(event.date.getTime() + event.duration * 3600000).toISOString(),
        className: `bg-${event.color}` 
    })), [selectedDay, eventsData]); 
    
    

    const handleDayChange = (day: DateRangeKey) => {
    setSelectedDay(day);
    };

    const {
        getEpgProps,
        getLayoutProps,
    } = useEpg({
        epg: filteredEpg,
        channels,
        startDate: dateRanges[selectedDay].start.toISOString(),
        endDate: dateRanges[selectedDay].end.toISOString(),
        height: 600,
        isBaseTimeFormat: true,   

    });

    const DayButtons = () => (
        <div className="flex justify-evenly mb-5">
            {Object.keys(dateRanges).map(day => (
                <button
                    key={day}
                    className={`px-6 py-3 hover:text-charcoalBlack focus:outline-none
                               ${selectedDay === day 
                                 ? 'text-2xl border-b-4 border-orange-500 text-charcoalBlack font-bold' 
                                 : 'text-2xl text-gray-500'}`}
                    onClick={() => handleDayChange(day as DateRangeKey)}
                >
                    {new Date(day).toLocaleDateString(undefined, { weekday: 'long'})}
                </button>
            ))}
        </div>
    );
    
    return (
        <div className="bg-white rounded-lg drop-shadow-lg p-6 mb-6 text-gray-900">
            <h1 className="text-sm pb-9">HawkHacks Hackathon starts at XX:XXPM! All times are in EST.</h1>
            <DayButtons />
            <div>
                <Epg {...getEpgProps()} theme={planbyTheme}>
                    <Layout {...getLayoutProps()} />
                </Epg>
            </div>
        </div>
    );
    

};
