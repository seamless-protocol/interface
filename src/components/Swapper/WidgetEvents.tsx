import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect } from 'react';

export const WidgetEvents = () => {
  const widgetEvents = useWidgetEvents();
  const notifyStart = () => console.log('Swap started');
  const notifyComplete = () => console.log('Swap complete');
  const notifyError = () => console.log('Something went wrong');

  useEffect(() => {
    const onRouteExecutionStarted = () => {
      notifyStart();
    };

    const onRouteExecutionCompleted = () => {
      notifyComplete();
    };
    const onRouteExecutionFailed = () => {
      notifyError();
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return null;
};
