import { StatsCard } from "@/components/ui/StatsCard"
import { useState, useEffect } from 'react'
import { useCreateStudySessionMutation } from '@/redux/features/studyAssistant/studyAssistantApi'
import {  Clock, Activity, Play, Pause, RotateCcw } from 'lucide-react'
import { useGetAllStudyPlannerQuery } from '@/redux/features/studyPlanner/studyPlannerApi'


const PomodoroSetting = ({ metadata }: { metadata?: any }) => {
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
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Pomodoro Timer</h2>

        {/* Timer Display */}
        <div className="flex items-center justify-center text-4xl font-mono font-bold text-gray-900 dark:text-white">
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
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
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
            className="px-4 py-2 border rounded-lg shadow-sm text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sTask.map((item: any, idx: number) => (
              <option key={idx} value={item.subject} className="dark:bg-gray-700 dark:text-white">
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
          title="Today Focus Time"
          value={metadata?.todayFocusTimeFormatted ?? 0}
          icon={Clock}
          color="purple"
          subtitle="minutes"
        />
      </div>
    </div>
  )
}

export default PomodoroSetting