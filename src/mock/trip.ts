import type { Trip } from '@/core/types';

export const MOCKED_TRIP: Trip = {
  id: 'MOCK_9b145ee8',
  title: '川藏线大环线',
  description: '6月2日南京出发，10天9晚。',
  coverImageURL:
    'https://drscdn.500px.org/photo/1047855817/q%3D80_m%3D1500/v2?sig=2d12add739182d0c1a7dc94050f1e1c35799b7ff773ad16cbcfdd9f246a105a7',
  startDate: Date.parse('2022-06-02'),
  days: [
    {
      id: 'c46d01d2-553a-4121-a0f7-8de33b949995',
      activities: [
        {
          id: '596efa83-ec2e-4b5f-8009-bfa91a0a8bc8',
          poi: {
            id: 'B0FFH0JJ8F',
            name: '成都天府国际机场',
            type: '交通设施服务;机场相关;飞机场',
            location: [104.446504, 30.307995],
            address: '芦葭镇',
            tel: '028-86906666',
            distance: null,
            website: '',
            pcode: '510000',
            citycode: '028',
            adcode: '510185',
            postcode: '',
            pname: '四川省',
            cityname: '成都市',
            adname: '简阳市',
            email: '',
            photos: [
              {
                title: '',
                url: 'http://store.is.autonavi.com/showpic/ea3b9e2246d6c97cd247772587ddc018',
              },
              {
                title: '',
                url: 'http://store.is.autonavi.com/showpic/46779c24217eebdc45c186c9ed8d2e4b',
              },
              {
                title: '',
                url: 'http://store.is.autonavi.com/showpic/8bc7a7b5be67df955fcb72bf7f7efdb1',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'e7107798-4591-4a45-9c86-d8a68db99689',
      activities: [
        {
          id: '3467a04a-606a-40f0-88f2-5029ec7ec5e4',
        },
      ],
    },
  ],
};
