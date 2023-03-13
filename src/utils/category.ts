export const categories = [
    {
        key: 'all',
        label: '전채보기',
    },
    {
        key: 'outer',
        label: '🧥 외투',
        children: [
            {
                key: 'jacket',
                label: '재킷'
            },
            {
                key: 'jumper',
                label: '점퍼'
            },
            {
                key: 'cardigan',
                label: '카디건'
            },
            {
                key: 'coat',
                label: '코트'
            },
            {
                key: 'raincoat',
                label: '우비'
            }
        ]
    },
    {
        key: 'top',
        label: '👕 상의',
        children: [
            {
                key: 'knit',
                label: '니트/스웨터'
            },
            {
                key: 'shirt',
                label: '블라우스/셔츠'
            },
            {
                key: 'tshirt',
                label: '티셔츠'
            },
        ]
    },
    {
        key: 'setup',
        label: '👗 원피스',
        children: [
            {
                key: 'onepiece',
                label: '원피스'
            },
            {
                key: 'jumpsuit',
                label: '점프슈트'
            }
        ]
    },
    {
        key: 'bottom',
        label: '👖 하의',
        children: [
            {
                key: 'pants',
                label: '바지'
            },
            {
                key: 'skirt',
                label: '스커트'
            },
            {
                key: 'jeans',
                label: '청바지'
            }
        ]
    }
]