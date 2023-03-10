export const categories = [
    {
        key: 'all',
        label: '์ ์ฑ๋ณด๊ธฐ',
    },
    {
        key: 'outer',
        label: '๐งฅ ์ธํฌ',
        children: [
            {
                key: 'jacket',
                label: '์ฌํท'
            },
            {
                key: 'jumper',
                label: '์ ํผ'
            },
            {
                key: 'cardigan',
                label: '์นด๋๊ฑด'
            },
            {
                key: 'coat',
                label: '์ฝํธ'
            },
            {
                key: 'raincoat',
                label: '์ฐ๋น'
            }
        ]
    },
    {
        key: 'top',
        label: '๐ ์์',
        children: [
            {
                key: 'knit',
                label: '๋ํธ/์ค์จํฐ'
            },
            {
                key: 'shirt',
                label: '๋ธ๋ผ์ฐ์ค/์์ธ '
            },
            {
                key: 'tshirt',
                label: 'ํฐ์์ธ '
            },
        ]
    },
    {
        key: 'setup',
        label: '๐ ์ํผ์ค',
        children: [
            {
                key: 'onepiece',
                label: '์ํผ์ค'
            },
            {
                key: 'jumpsuit',
                label: '์ ํ์ํธ'
            }
        ]
    },
    {
        key: 'bottom',
        label: '๐ ํ์',
        children: [
            {
                key: 'pants',
                label: '๋ฐ์ง'
            },
            {
                key: 'skirt',
                label: '์ค์ปคํธ'
            },
            {
                key: 'jeans',
                label: '์ฒญ๋ฐ์ง'
            }
        ]
    }
]

export const findParentLabel = (label:string) => {
    const parent = categories.find((item) =>
        item.children?.some((child) => child.label === label)
    );

    const key = parent ? (parent.key === 'setup' ? 'bottom' : parent.key) : ''
    return key
};