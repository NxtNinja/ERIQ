"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
    Home,
    Users,
    MessageCircle,
    Settings,
    Search,
    Bell,
    Edit3,
    Activity,
    Heart,
    User,
    Pill,
    MoreHorizontal,
} from "lucide-react"

export default function UserProfile() {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors">
             

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Navigation Tabs */}
                <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-gray-800 px-6 transition-colors">
                    <nav className="flex space-x-8">
                        <Button variant="ghost" className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 rounded-none transition-colors">
                            Patient profile
                        </Button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-[#0f172a] transition-colors">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Patient Profile Card */}
                        <div className="col-span-4">
                            <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <Avatar className="h-20 w-20">
                                                    <AvatarImage src="/patient-photo.webp" />
                                                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">AH</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1 bg-orange-500 dark:bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                    !
                                                </div>
                                                <div className="absolute -bottom-1 left-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                                    2
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Ahmed Ali Hussain</h3>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>Male</span>
                                                    <span>•</span>
                                                    <span>Elshiekh zayed,Giza</span>
                                                    <span>•</span>
                                                    <span>Accountant</span>
                                                    <span>•</span>
                                                    <span>12 Dec 1992 (38 years)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </div>

                                    {/* Health Metrics */}
                                    <div className="grid grid-cols-4 gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">22.4</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">BMI • 10</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                92 <span className="text-sm font-normal">kg</span>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Weight • 10 kg</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                175 <span className="text-sm font-normal">Cm</span>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Height</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">124/80</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Blood pressure • 10</div>
                                        </div>
                                    </div>

                                    {/* Own Diagnosis */}
                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Own diagnosis</h4>
                                        <div className="flex space-x-2">
                                            <Badge variant="destructive" className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">Obesity</Badge>
                                            <Badge variant="destructive" className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">Uncontrolled type 2</Badge>
                                        </div>
                                    </div>

                                    {/* Health Barriers */}
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Health barriers</h4>
                                        <div className="flex space-x-2">
                                            <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Fear of medication</Badge>
                                            <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Fear of insulin</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Timeline and Medical History */}
                        <div className="col-span-8 space-y-6">
                            {/* Medical History */}
                            <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>Medical history</span>
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Edit
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <Heart className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">chronic disease</div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">IHD, Obesity, Chronic thyroid disorder</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded mt-0.5"></div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Surgery</div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">Liposuction</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="h-5 w-5 bg-yellow-500 dark:bg-yellow-600 rounded mt-0.5"></div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Diabetes related complication</div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        Nephropathy, Neuropathy, Retinopathy, Diabetic foot, Sexual dysfunction
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="h-5 w-5 bg-red-500 dark:bg-red-600 rounded mt-0.5"></div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Diabetes Emergencies</div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">Diabetic Ketoacidosis</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <Users className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Family disease</div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">Obesity (Father)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Patient Summary */}
                            <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>Patient Summary</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Current Condition</h4>
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    38-year-old male accountant with uncontrolled Type 2 diabetes and obesity. BMI of 22.4 with
                                                    recent weight gain of 10kg. Blood pressure elevated at 124/80.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Key Concerns</h4>
                                                <ul className="text-sm space-y-1 text-gray-900 dark:text-gray-100">
                                                    <li>• Medication adherence issues</li>
                                                    <li>• Fear of insulin therapy</li>
                                                    <li>• Chronic thyroid disorder</li>
                                                    <li>• History of cardiovascular complications</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Treatment Goals</h4>
                                                <ul className="text-sm space-y-1 text-gray-900 dark:text-gray-100">
                                                    <li>• Improve HbA1c levels (current: 10.4%)</li>
                                                    <li>• Weight management and BMI reduction</li>
                                                    <li>• Blood pressure control</li>
                                                    <li>• Medication compliance improvement</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Risk Factors</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                        High HbA1c
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                        Obesity
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                        Family History
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                        Poor Adherence
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Medications */}
                            <Card className="bg-white dark:bg-[#1e293b] border-gray-200 dark:border-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                                        <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span>Medications</span>
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Edit
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-sm text-gray-500 dark:text-gray-400">
                                                    <th className="pb-2">Name</th>
                                                    <th className="pb-2">Ind.</th>
                                                    <th className="pb-2">Status</th>
                                                    <th className="pb-2">Sig.</th>
                                                    <th className="pb-2">Start date</th>
                                                    <th className="pb-2">Assign by</th>
                                                    <th className="pb-2">Note</th>
                                                    <th className="pb-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <td className="py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded flex items-center justify-center">
                                                                <Pill className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-100">ACTRAPID • HM 1</div>
                                                                <div className="text-gray-500 dark:text-gray-400">Amaryl 1 mg</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                                            Adherent
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">Patient</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <td className="py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center">
                                                                <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-100">Panadol 1000m</div>
                                                                <div className="text-gray-500 dark:text-gray-400">Vitacid 1000m</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                                            Somehow adherent
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">Patient</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <td className="py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                                                <Pill className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-100">Amaryl 1 mg</div>
                                                                <div className="text-gray-500 dark:text-gray-400">Amaryl 1 mg</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Badge variant="destructive" className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">Not adherent</Badge>
                                                    </td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">Patient</td>
                                                    <td className="py-3 text-gray-900 dark:text-gray-100">--</td>
                                                    <td className="py-3">
                                                        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
