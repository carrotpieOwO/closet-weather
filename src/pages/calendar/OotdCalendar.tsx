import type { Dayjs } from "dayjs";
import {Calendar, Col, Row, Select, Typography, Empty } from 'antd';
import 'dayjs/locale/ko'; 
import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData'
import { useEffect, useState } from "react";
import { ClothItem, QueryProps } from "../../index.d";
import { getQuery } from "../../utils/utils";
import { useCollection } from "../../hooks/useCollection";
import styled from "styled-components";
import weatherIcons from "../../utils/weatherIcons";


dayjs.extend(localeData);

const getListData = (value: Dayjs, ootdDocument:any[]) => {
    if (ootdDocument) {
        const filter = ootdDocument.filter(d => d.id === dayjs(value).format('YYYYMMDD'))
        let savedOutfit;
        if (filter.length > 0) {
            savedOutfit = Object.values(filter[0])
                .filter(item => item instanceof Object && 'title' in item) as ClothItem[]
        }
        return savedOutfit ? savedOutfit : []
    } else {
        return []
    }
};

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
const CoverImage = styled.div<{image:string}>`
    overflow: hidden;
    height: 150px; 
    width: 100%;
    background-image: ${props => `url(${props.image})`};
    background-size:cover;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
`
const Detail = styled.div`
    margin: 30px;
    padding: 20px 30px;
    background:rgba(255,255,255,.3);
    border-radius: 20px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
    /* min-height: 150px; */
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
interface SelectedDaysOotd {
    ootd: ClothItem[];
    time?: string;
    location?: string;
    icon?: string;
    temp?: number;
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
        console.log('ootdDocument', ootdDocument)
        const selectedId = dayjs(selectedDate).format('YYYYMMDD')
        const selectedData = ootdDocument?.filter(doc => doc.id === selectedId) as TempType[] | undefined;
        console.log('selectedData', selectedOotd)
        let savedOutfit:ClothItem[] = [];
        let savedTime;
        if (selectedData && selectedData.length > 0) {
            savedOutfit = Object.values(selectedData[0])
                .filter(item => item instanceof Object && 'title' in item) as ClothItem[]
       
            
            const milliseconds = selectedData[0].createdTime.seconds * 1000 + selectedData[0].createdTime.nanoseconds / 1000000;
            savedTime = dayjs(milliseconds).format('HH:mm');
            console.log('date', savedTime)
                         
            const selectedDaysOotd = {
                ootd: savedOutfit,
                time: savedTime,
                location: selectedData && selectedData[0].location,
                icon: selectedData && selectedData[0].icon,
                temp: selectedData && selectedData[0].currentTemp,
            }
            setSelectedOotd(selectedDaysOotd)
        } else {
            setSelectedOotd(undefined)
        }

   
    }, [selectedDate])


    useEffect(() => {
        setSelectedDate(dayjs())
        console.log('dayjs()', dayjs())
    }, [ootdDocument])

    const onSelect = (newValue: Dayjs) => {
        console.log('newval', newValue)
        setSelectedDate(newValue)
    };
    
    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value, ootdDocument!);
        
        return (
          <ul className="events" style={{padding: 0, background: 'transparent'}}>
            {listData.map((item) => (
                <img key={`calendar-${item.id}`} src={item.image} width='30%' alt={item.title}/>
            ))}
          </ul>
        );
    };

    const headerRender = ({ value, onChange }:{ value: Dayjs, onChange: (n:Dayjs) => void}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        let current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current = current.month(i);
          months.push(localeData.monthsShort(current));
        }

        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>,
          );
        }

        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>,
          );
        }
        return (
            <>
                <Row gutter={8} style={{justifyContent: 'space-between',alignItems: 'center', padding: '0 30px', background: 'transparent'}}>
                <Typography.Title level={4}>Monthly Outfit ❤️</Typography.Title>
                    <div style={{display:'flex'}}>
                        <Col>
                            <Select
                                value={year}
                                onChange={(newYear) => {
                                    const now = value.clone().year(newYear);
                                    onChange(now);
                                }}
                                >
                                {options}
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                value={month}
                                onChange={(newMonth) => {
                                    const now = value.clone().month(newMonth);
                                    onChange(now);
                                }}
                                >
                                {monthOptions}
                            </Select>
                        </Col>
                    </div>
                </Row>
            </>
        );
      }
    

    return (
        <>
            {
                selectedOotd ?
                <Detail>
            <Row>
                <Col xs={24} md={12}>
                    <Row gutter={10} style={{alignItems: 'center'}}>
                        {
                            
                            selectedOotd.ootd.map( ootd => 
                                <Col xs={24} sm={8} md={7} key={`cal-${ootd.id}`}>
                                    <CoverImage image={ootd.image} />
                                </Col>    
                            )
                        }
                    </Row>
                </Col>
                <Col xs={24} md={12}>
                    <Row style={{justifyContent:'flex-end'}}>
                        <Col xs={24} md={7}>
                        <Typography.Title level={4} style={{marginBottom:'1em'}}>{ dayjs(selectedDate).format('YYYY-MM-DD') }</Typography.Title>

                            <div>기온🌡️: { selectedOotd.temp }</div>
                            <div>착용시간⌚️: { selectedOotd.time }</div>
                            <div>in { selectedOotd.location }</div>

                        </Col>
                        <Col xs={24} md={7}>
                        <img src={weatherIcons[`${selectedOotd.icon}`]} alt='weatherIcon' style={{maxHeight:'150px'}}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </Detail>
            :
            <Detail>
               <div style={{height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
               </div>
            </Detail>
        }
            <CustomCalendar 
                onSelect={onSelect} dateCellRender={dateCellRender} headerRender={headerRender}
            />
        </>
    )
}