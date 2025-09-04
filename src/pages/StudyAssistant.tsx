import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { useCreateStudySessionMutation, useGetStudySessionQuery } from '@/redux/features/studyAssistant/studyAssistantApi'
import { Calendar, Clock, Coffee, Activity, Play, Pause, RotateCcw } from 'lucide-react'
import { useGetAllStudyPlannerQuery } from '@/redux/features/studyPlanner/studyPlannerApi'

const PomodoroSection = ({ metadata }: { metadata?: any }) => {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState(25)
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')
  const [createStudy] = useCreateStudySessionMutation()
  const { data: studyTasks } = useGetAllStudyPlannerQuery("")
  const sTask = studyTasks?.data?.data || []
  const [selectedSubject, setSelectedSubject] = useState(sTask[0]?.subject || 'Pomodoro Session')

  const timerOptions = [1, 5, 10, 15, 20, 25]

  useEffect(() => {
    let timer: NodeJS.Timeout

    const finishTimer = async () => {
      const payload = {
        studyTask: selectedSubject,
        duration: selectedMinutes,
        type: sessionType,
      }
      await createStudy(payload)
    }

    if (isRunning && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000)
    } else if (isRunning && seconds <= 0) {
      setIsRunning(false)
      finishTimer()
    }

    return () => clearInterval(timer)
  }, [isRunning, seconds, selectedMinutes, sessionType, selectedSubject])

  const handleStartPause = () => setIsRunning(!isRunning)
  const handleReset = () => {
    setSeconds(selectedMinutes * 60)
    setIsRunning(false)
  }
  const handleChangeTimer = (minutes: number) => {
    setSelectedMinutes(minutes)
    setSeconds(minutes * 60)
    setIsRunning(false)
  }
  const handleChangeSessionType = (type: 'focus' | 'break') => setSessionType(type)
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedSubject(e.target.value)

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Pomodoro Timer</h2>

        {/* Timer Display */}
        <div className="flex items-center justify-center text-4xl font-mono font-bold">
          {formatTime(seconds)}
        </div>

        {/* Session Type Selector */}
        <div className="flex justify-center gap-3">
          {['focus', 'break'].map(type => (
            <button
              key={type}
              onClick={() => handleChangeSessionType(type as 'focus' | 'break')}
              className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${
                sessionType === type
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Timer Options */}
        <div className="flex justify-center gap-2 flex-wrap">
          {timerOptions.map(option => (
            <button
              key={option}
              onClick={() => handleChangeTimer(option)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedMinutes === option
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {option} min
            </button>
          ))}
        </div>

        {/* Start / Pause & Reset */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            {isRunning ? <Pause /> : <Play />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
          >
            <RotateCcw />
            Reset
          </button>
        </div>

        {/* Subject Select */}
        <div className="flex justify-center">
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="px-4 py-2 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sTask.map((item: any, idx: number) => (
              <option key={idx} value={item.subject}>
                {item.subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pomodoro Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Pomodoro Sessions Today"
          value={metadata?.totalSessions ?? 0}
          icon={Activity}
          color="green"
          subtitle="count"
        />
        <StatsCard
          title="Pomodoro Focus Time"
          value={metadata?.todayFocusTime ?? 0}
          icon={Clock}
          color="purple"
          subtitle="minutes"
        />
      </div>
    </div>
  )
}


const StudyAssistant = () => {
  const { data: metadatas } = useGetStudySessionQuery('')
  const metadata = metadatas?.data?.metadata
  const sessions = metadatas?.data?.data || []

  return (
    <div className="p-6 space-y-10">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <StatsCard
          title="Total Sessions"
          value={metadata?.totalSessions ?? 0}
          icon={Calendar}
          color="blue"
          subtitle="count"
        />
        <StatsCard
          title="Total Focus Time"
          value={metadata?.totalFocusTimeFormatted ?? '0h 0m'}
          icon={Clock}
          color="green"
          subtitle="time"
        />
        <StatsCard
          title="Total Break Time"
          value={metadata?.totalBreakTimeFormatted ?? '0h 0m'}
          icon={Coffee}
          color="purple"
          subtitle="time"
        />
        <StatsCard
          title="Today's Focus Time"
          value={metadata?.todayFocusTimeFormatted ?? '0h 0m'}
          icon={Clock}
          color="teal"
          subtitle="time"
        />
        <StatsCard
          title="Week Focus Time"
          value={metadata?.weekFocusTimeFormatted ?? '0h 0m'}
          icon={Activity}
          color="red"
          subtitle="time"
        />
        <StatsCard
          title="Month Focus Time"
          value={metadata?.monthFocusTimeFormatted ?? '0h 0m'}
          icon={Activity}
          color="orange"
          subtitle="time"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Pomodoro Timer + Features */}
        <PomodoroSection metadata={metadata} />

        {/* Right Column: Today's Study History */}
        <div className="p-6 bg-white rounded-2xl shadow-md max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Today's Study History</h2>
          <ul className="space-y-4">
            {sessions.length === 0 && (
              <li className="text-center text-gray-500">No sessions today</li>
            )}
            {sessions.map((session: any) => (
              <li
                key={session._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{session.studyTask}</p>
                  <p className="text-sm text-gray-500">{session.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{session.duration} min</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


export default StudyAssistant
