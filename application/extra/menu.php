<?php
return 
[
	'menu' => 
	[
//        [
//            'title' => '图片管理',
//            'list' =>
//                [
//                    [
//                        'controller' => 'Featured',
//                        'icon' => 'glyphicon glyphicon-film',
//                        'title' => '轮播图管理',
//                        'href' => '#',
//                        'list' =>
//                            [
//                                [
//                                    'action' => 'index',
//                                    'name' => '轮播图列表',
//                                    'href' => 'Featured/index'
//                                ],
//                                [
//                                    'action' => 'add',
//                                    'name' => '添加图片',
//                                    'href' => 'Featured/add',
//                                ]
//                            ]
//                    ]
//                ]
//        ],
        [
            'title' => '内容板块',
            'list' =>
                [
                    [
                        'controller' => 'Suggestion',
                        'icon' => 'glyphicon glyphicon-film',
                        'title' => '意见反馈',
                        'href' => '#',
                        'list' =>
                            [
                                [
                                    'action' => 'index',
                                    'name' => '反馈列表',
                                    'href' => 'Suggestion/index'
                                ],
                                [
                                    'action' => 'add',
                                    'name' => '添加反馈',
                                    'href' => 'Suggestion/add'
                                ],
                            ]
                    ]
                ]
        ],
        [
                'title' => '个人中心',
                'list' =>
                    [
                        [
                            'controller' => 'User',
                            'icon' => 'glyphicon glyphicon-hand-right',
                            'title' => '个人信息',
                            'href' => '#',
                            'list' =>
                                [
                                    [
                                        'action' => 'index',
                                        'name' => '个人资料',
                                        'href' => 'User/index'
                                    ],
                                    [
                                        'action' => 'edit',
                                        'name' => '编辑信息',
                                        'href' => 'User/edit'
                                    ]
                                ]
                        ]
                    ]
        ],
		[
			'title' => '好友管理',
			'list' => 
			[
				[
					'controller' => 'User',
					'icon' => 'glyphicon glyphicon-user',
					'title' => '好友列表',
					'href' => 'UserGroupMember/index',
					'list' => []
				],
				[
					'controller' => 'UserGroup',
					'icon' => 'glyphicon glyphicon-tag',
					'title' => '分组列表',
					'href' => 'UserGroup/index',
					'list' => []
				]
			]
		],
            [
                'title' => '群管理',
                'list' =>
                    [
                        [
                            'controller' => 'User',
                            'icon' => 'glyphicon glyphicon-user',
                            'title' => '创建的群列表',
                            'href' => '#',
                            'list' => [
                                [
                                    'action' => 'index',
                                    'name' => '我的群',
                                    'href' => 'Group/create'
                                ],

                            ]
                        ],
                        [
                            'controller' => 'User',
                            'icon' => 'glyphicon glyphicon-user',
                            'title' => '加入的群列表',
                            'href' => 'Group/join',
                            'list' => []
                        ],

                    ]
            ],
	]
];