import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Server,
  School,
  BarChart3,
  Building,
  UserCheck,
  Filter,
  ChevronDown,
  Search,
  Download,
  Mic
} from 'lucide-react';
import VapiConcurrencyMonitor from './VapiConcurrencyMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

// Empty data structures for initial state - will be populated with real data as institutions use the platform
const userActivityData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 }
];

const systemHealthData = [
  { name: 'Mon', errors: 0 },
  { name: 'Tue', errors: 0 },
  { name: 'Wed', errors: 0 },
  { name: 'Thu', errors: 0 },
  { name: 'Fri', errors: 0 },
  { name: 'Sat', errors: 0 },
  { name: 'Sun', errors: 0 }
];

// Empty institutions array - will be populated from Firebase
const institutionsData = [];

// Default empty analytics data
const institutionAnalytics = {
  resumeMetrics: {
    totalViews: 0,
    avgViewsPerResume: 0,
    totalDownloads: 0,
    contactClickRate: "0%",
    improvementRate: "0%"
  },
  interviewMetrics: {
    completionRate: "0%",
    avgScore: 0,
    commonWeaknesses: [],
    topPerformingQuestions: [],
    difficultyDistribution: { easy: "0%", medium: "0%", hard: "0%" }
  },
  departmentComparison: []
};

const AdminDashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="overview" tooltip="View platform overview and key metrics">Platform Overview</TabsTrigger>
          <TabsTrigger value="institutions" tooltip="Manage all institutions in the platform">Institutions</TabsTrigger>
          <TabsTrigger value="analytics" tooltip="View detailed platform analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system" tooltip="Check system status and health">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <h2 className="text-2xl font-bold">Platform Overview</h2>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6 lg:grid-cols-4'}`}>
            <Card tooltip="View total users across the platform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No data yet</p>
              </CardContent>
            </Card>
            
            <Card tooltip="View all completed interviews on the platform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No data yet</p>
              </CardContent>
            </Card>
            
            <Card tooltip="Average time users spend in interview sessions">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 min</div>
                <p className="text-xs text-muted-foreground">No data yet</p>
              </CardContent>
            </Card>
            
            <Card tooltip="Platform engagement percentage showing user activity">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">No data yet</p>
              </CardContent>
            </Card>
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-6'}`}>
            <Card className="col-span-1" tooltip="User growth and activity trends over time">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>User growth and engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { color: "hsl(var(--primary))" },
                  }}
                  className="aspect-[4/3]"
                >
                  <LineChart data={userActivityData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1" tooltip="System errors and uptime statistics">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Error rates and system uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    errors: { color: "hsl(var(--destructive))" },
                    uptime: { color: "hsl(var(--primary))" },
                  }}
                  className="aspect-[4/3]"
                >
                  <BarChart data={systemHealthData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="errors" 
                      fill="hsl(var(--destructive))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="institutions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Institutions</h2>
            <Button 
              onClick={() => navigate('/admin/add-institution')}
              tooltip="Add a new institution to the platform"
            >
              Add Institution
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search institutions..."
                    className="pl-8 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="gap-1"
                        tooltip="Filter institutions by criteria"
                      >
                        <Filter className="h-4 w-4" />
                        Filter
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>All Institutions</DropdownMenuItem>
                      <DropdownMenuItem>High Engagement</DropdownMenuItem>
                      <DropdownMenuItem>Low Engagement</DropdownMenuItem>
                      <DropdownMenuItem>Recently Added</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => navigate('/admin/export')}
                    tooltip="Export institutions data to CSV/Excel"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[250px]">Institution</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Interviews</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Resume Uploads</TableHead>
                      <TableHead>Licenses Used</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {institutionsData.map(institution => (
                      <TableRow key={institution.id}>
                        <TableCell className="font-medium">
                          {institution.name}
                        </TableCell>
                        <TableCell>
                          {institution.activeStudents}/{institution.totalStudents}
                          <div className="w-24 mt-1">
                            <Progress 
                              value={(institution.activeStudents / institution.totalStudents) * 100} 
                              className="h-1.5" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>{institution.interviewsCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {institution.avgScore}/100
                            <div 
                              className={`h-2 w-2 rounded-full ${
                                institution.avgScore >= 85 ? 'bg-green-500' : 
                                institution.avgScore >= 75 ? 'bg-amber-500' : 
                                'bg-red-500'
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{institution.resumeUploads}</TableCell>
                        <TableCell>{institution.licensesUsed}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs 
                            ${institution.engagement === 'Very High' || institution.engagement === 'High' ? 
                              'bg-green-100 text-green-800' : 
                              institution.engagement === 'Medium' ? 
                              'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                            {institution.engagement}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                tooltip="Actions for this institution"
                              >
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/institution/${institution.id}/analytics`)}
                              >
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Manage Users</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Institution Analytics</h2>
              {selectedInstitution !== "all" && (
                <p className="text-muted-foreground">
                  Viewing analytics for: {institutionsData.find(i => i.id === selectedInstitution)?.name || "All Institutions"}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <select 
                className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
              >
                <option value="all">All Institutions</option>
                {institutionsData.map(institution => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                className="gap-1"
                onClick={() => navigate('/admin/export')}
                tooltip="Export analytics report"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="resume">
            <TabsList className="mb-6">
              <TabsTrigger value="resume">Resume Analytics</TabsTrigger>
              <TabsTrigger value="interview">Interview Analytics</TabsTrigger>
              <TabsTrigger value="departments">Department Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Analytics</CardTitle>
                  <CardDescription>
                    Aggregated resume performance metrics across institutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.resumeMetrics.totalViews}</div>
                            <div className="text-sm text-muted-foreground">Total Resume Views</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.resumeMetrics.avgViewsPerResume}</div>
                            <div className="text-sm text-muted-foreground">Avg Views Per Resume</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.resumeMetrics.totalDownloads}</div>
                            <div className="text-sm text-muted-foreground">Total Downloads</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.resumeMetrics.contactClickRate}</div>
                            <div className="text-sm text-muted-foreground">Contact Click Rate</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.resumeMetrics.improvementRate}</div>
                            <div className="text-sm text-muted-foreground">Improvement Rate</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Resume Views by Institution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-12 w-12 text-muted-foreground opacity-30" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Resume Quality Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-12 w-12 text-muted-foreground opacity-30" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interview">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Analytics</CardTitle>
                  <CardDescription>
                    Aggregated interview performance metrics across institutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.interviewMetrics.completionRate}</div>
                            <div className="text-sm text-muted-foreground">Completion Rate</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">{institutionAnalytics.interviewMetrics.avgScore}/100</div>
                            <div className="text-sm text-muted-foreground">Average Score</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Easy: {institutionAnalytics.interviewMetrics.difficultyDistribution.easy}</span>
                              <span>Medium: {institutionAnalytics.interviewMetrics.difficultyDistribution.medium}</span>
                              <span>Hard: {institutionAnalytics.interviewMetrics.difficultyDistribution.hard}</span>
                            </div>
                            <div className="flex h-2 mb-2">
                              <div 
                                className="bg-green-500 rounded-l-full" 
                                style={{ width: institutionAnalytics.interviewMetrics.difficultyDistribution.easy }}
                              />
                              <div 
                                className="bg-amber-500" 
                                style={{ width: institutionAnalytics.interviewMetrics.difficultyDistribution.medium }}
                              />
                              <div 
                                className="bg-red-500 rounded-r-full" 
                                style={{ width: institutionAnalytics.interviewMetrics.difficultyDistribution.hard }}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground">Difficulty Distribution</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Common Weaknesses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {institutionAnalytics.interviewMetrics.commonWeaknesses.map((weakness, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{weakness}</span>
                                  <span className="text-sm font-medium">{100 - index * 10}%</span>
                                </div>
                                <Progress value={100 - index * 10} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Top Performing Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {institutionAnalytics.interviewMetrics.topPerformingQuestions.map((question, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{question}</span>
                                  <span className="text-sm font-medium">{85 - index * 5}%</span>
                                </div>
                                <Progress value={85 - index * 5} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="departments">
              <Card>
                <CardHeader>
                  <CardTitle>Department Comparison</CardTitle>
                  <CardDescription>
                    Compare performance between departments across institutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Resume Score</TableHead>
                          <TableHead>Interview Score</TableHead>
                          <TableHead>Gap</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {institutionAnalytics.departmentComparison.map((dept, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={dept.resumeScore} className="h-2 w-24" />
                                <span>{dept.resumeScore}/100</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={dept.interviewScore} className="h-2 w-24" />
                                <span>{dept.interviewScore}/100</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {Math.abs(dept.resumeScore - dept.interviewScore)}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({dept.resumeScore > dept.interviewScore ? 'Resume stronger' : 'Interview stronger'})
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resume vs Interview Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 h-64 rounded-lg flex items-center justify-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground opacity-30" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-6">
          <h2 className="text-2xl font-bold">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Status</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">All Systems Operational</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">API Services</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">99.9% Uptime</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Error Reports (Last 24h)</span>
                    </div>
                    <span className="text-sm font-medium">0 Errors</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">System Load</span>
                    </div>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <VapiConcurrencyMonitor />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
