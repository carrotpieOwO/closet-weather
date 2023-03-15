import type { Dayjs } from "dayjs";
import {Calendar } from 'antd';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ClothItem, QueryProps, SelectedDaysOotd } from "../../index.d";
import { getQuery } from "../../utils/utils";
import { useCollection } from "../../hooks/useCollection";
import styled from "styled-components";
import CalendarHeader from "./CalendarHeader";
import Detail from "./Detail";
import CalendarDate from "./CalendarDate";

const CustomCalendar = styled(Calendar)`
    background: rgba(255, 255, 255, .5);
    margin: 30px;
    padding: 20px 30px 0 30px;
    border-radius: 20px;
    .ant-picker-panel {
        background: transparent !important;
        padding: 30px 30px 0 30px;
    }
`
interface TempType {
    [key: number] : ClothItem,
    createdTime: {
        seconds: number,
        nanoseconds: number,
    },
    currentTemp: number,
    icon: string,
    location: string,
    id: string,
}

const createOotdByDate = (selectedData: TempType) => {
    // ootd data에서 clothItem타입인 배열을 필터링한다.
    const savedOutfit = Object.values(selectedData)
        .filter(item => item instanceof Object && 'title' in item) as ClothItem[]

    // createdTime값으로 저장된 시간값을 만든다.
    const milliseconds = selectedData.createdTime.seconds * 1000 + selectedData.createdTime.nanoseconds / 1000000;
    const savedTime = dayjs(milliseconds).format('HH:mm');
    
    // 최종적으로 화면에 표시할 데이터가 담긴 object
    const selectedDaysOotd = {
        ootd: savedOutfit,
        time: savedTime,
        location: selectedData && selectedData.location,
        icon: selectedData && selectedData.icon,
        temp: selectedData && selectedData.currentTemp,
    }

    return selectedDaysOotd;
}

export default function OotdCalendar({uid}: {uid:string}) {
    const startOfMonth = dayjs().startOf('month');
    const endOfMonth = dayjs().endOf('month');
    const query = getQuery({ uid: uid, path:'createdTime', where: ['>=', '<='], search: [ startOfMonth.toDate(),endOfMonth.toDate() ]})
    const [ ootdQuery, setOotdQuery ] = useState<QueryProps[]>(query)
    const { documents : ootdDocument } = useCollection('ootd', ootdQuery) // ootd 불러오기
    const [ selectedDate, setSelectedDate ] = useState(() => dayjs());
    const [ selectedOotd, setSelectedOotd ] = useState<SelectedDaysOotd>();

    useEffect(() => {
        const selectedId = dayjs(selectedDate).format('YYYYMMDD');
        // 선택한 date값에 해당하는 ootd Data를 필터링한다.
        const selectedData = ootdDocument?.filter(doc => doc.id === selectedId) as TempType[] | undefined;
        
        if (selectedData && selectedData.length > 0) {
            // selectedData가 있을 경우 화면에 표시할 object 생성
            const selectedDaysOotd = createOotdByDate(selectedData[0]);
            setSelectedOotd(selectedDaysOotd)
        } else {
            setSelectedOotd(undefined)
        }

    }, [selectedDate])


    useEffect(() => {
        setSelectedDate(dayjs())
    }, [ootdDocument])

    const onSelect = (newValue: Dayjs) => {
        setSelectedDate(newValue)
    };
    
    const dateCellRender = (value: Dayjs) => {
        return (
            <CalendarDate selectedDay={value} ootdDocument={ootdDocument}/>
        );
    };

    return (
        <>
            {
                selectedOotd ?
                <Detail selectedOotd={selectedOotd} selectedDate={selectedDate} />
                : <Detail />
            }
            <CustomCalendar 
                onSelect={onSelect} dateCellRender={dateCellRender} headerRender={CalendarHeader}
            />
        </>
    )
}