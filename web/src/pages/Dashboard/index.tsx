import { format, isAfter, isToday, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DayPicker, { DayModifiers } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { FiClock, FiPower, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import * as S from './styles'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  hourFormatted: string
  user: {
    name: string
    avatar_url: string
  }
}

export const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => setMonthAvailability(response.data))
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => ({
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        }))

        setAppointments(appointmentsFormatted)
      })
  }, [selectedDate])

  const disableDays = useMemo(() => {
    return monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        return new Date(year, month, monthDay.day)
      })
  }, [currentMonth, monthAvailability])

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR })
  }, [selectedDate])

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12
    })
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <img src={logoImg} alt="Logo GoBarber" />

          <S.HeaderProfile>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <FiUser size={30} color="#ff9000" />
            )}

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </S.HeaderProfile>

          <button type="button" onClick={signOut}>
            <FiPower size={20} />
          </button>
        </S.HeaderContent>
      </S.Header>

      <S.Content>
        <S.Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{`${selectedWeekDay}-feira`}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <S.NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                {nextAppointment.user.avatar_url ? (
                  <img
                    src={nextAppointment.user.avatar_url}
                    alt={nextAppointment.user.name}
                  />
                ) : (
                  <FiUser size={30} color="#ff9000" />
                )}

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock size={24} />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </S.NextAppointment>
          )}

          <S.Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {morningAppointments.map(appointment => (
              <S.Appointment key={appointment.id}>
                <span>
                  <FiClock size={20} />
                  {appointment.hourFormatted}
                </span>

                <div>
                  {appointment.user.avatar_url ? (
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                  ) : (
                    <FiUser size={30} color="#ff9000" />
                  )}

                  <strong>{appointment.user.name}</strong>
                </div>
              </S.Appointment>
            ))}
          </S.Section>
          <S.Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste período</p>
            )}

            {afternoonAppointments.map(appointment => (
              <S.Appointment key={appointment.id}>
                <span>
                  <FiClock size={20} />
                  {appointment.hourFormatted}
                </span>

                <div>
                  {appointment.user.avatar_url ? (
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                  ) : (
                    <FiUser size={30} color="#ff9000" />
                  )}

                  <strong>{appointment.user.name}</strong>
                </div>
              </S.Appointment>
            ))}
          </S.Section>
        </S.Schedule>
        <S.Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </S.Calendar>
      </S.Content>
    </S.Container>
  )
}
