import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect } from 'react';

export const WidgetEvents = () => {
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = () => {
      console.log('onRouteExecutionStarted fired.');
    };
    const onRouteExecutionUpdated = () => {
      console.log('onRouteExecutionUpdated fired.');
    };
    const onRouteExecutionCompleted = () => {
      console.log('onRouteExecutionCompleted fired.');
    };
    const onRouteExecutionFailed = () => {
      console.log('onRouteExecutionFailed fired.');
    };
    const onRouteHighValueLoss = () => {
      console.log('onRouteHighValueLoss continued.');
    };
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted);
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return null;
};
