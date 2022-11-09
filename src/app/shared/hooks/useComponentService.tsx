import {
  useRef,
  useEffect,
  useLayoutEffect,
  Dispatch,
  SetStateAction
} from "react";
import { ServiceBaseType } from "../componentsStateServices/ServiceBase";

export const useComponentService = <ServiceType extends ServiceBaseType, ServiceParams>(
  {
    Service,
    serviceChangeHandler,
    serviceParams
  }: {
  Service: { new(params: ServiceParams): ServiceType; }
  serviceChangeHandler: Dispatch<SetStateAction<null>>;
  serviceParams: ServiceParams
}) => {
  const service = useRef<ServiceType>();

  if (!service.current) {
    service.current = new Service(serviceParams) as ServiceType;
  }

  useLayoutEffect(() => {
    const serviceInstance = service.current as ServiceType;
    serviceInstance.subscribe(serviceChangeHandler);
  }, []);

  useEffect(() => {
    const serviceInstance = service.current as ServiceType;
    serviceInstance.handleMount();

    return (): void => {
      serviceInstance.unsubscribe();
      serviceInstance.handleUnmount();
    };
  }, []);

  return service.current;
};
