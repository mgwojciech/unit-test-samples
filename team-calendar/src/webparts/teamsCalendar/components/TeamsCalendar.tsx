import { ContextualMenu, Label, Panel, Spinner } from 'office-ui-fabric-react';
import React, { useState, useEffect } from 'react';
import { TeamsEventsManager } from '../../../manager/TeamsEventsManager';
import { ITeamsCalendarProps } from './ITeamsCalendarProps';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { IEvent } from '../../../model/IEvent';
import { useBoolean } from '@uifabric/react-hooks';

export default function TeamsCalendar(props: ITeamsCalendarProps) {
  let manager = new TeamsEventsManager(props.context);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({} as IEvent);
  const [isPanelOpened, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);


  const loadData = async () => {
    setEvents(await manager.getTeamsEvents());
    setLoading(false);
    props.context.sdks.microsoftTeams.teamsJs.initialize();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return <div><FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    displayEventEnd={true}
    eventClick={(eventArgs: EventClickArg) => {
      setSelectedEvent(events.filter(ev => ev.id === eventArgs.event.id)[0]);
      openPanel();
    }}
    events={
      events.map((event: IEvent) => ({
        id: event.id,
        title: event.subject,
        start: event.startTime,
        end: event.endTime,
      }))
    }
  /><Panel
    headerText={selectedEvent ? selectedEvent.subject : ""}
    isOpen={isPanelOpened}
    onDismiss={dismissPanel}
    // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
    closeButtonAriaLabel="Close"
  >
      <div>
        <div>
          {selectedEvent.startTime ? selectedEvent.startTime.toLocaleDateString() : ""}
          {selectedEvent.endTime ? selectedEvent.endTime.toLocaleDateString() : ""}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: selectedEvent.eventBody }}
        >
        </div>
      </div>
    </Panel></div>;
}
