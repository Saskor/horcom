import {
  useRef,
  useEffect
} from "react";

type MountableService = {
  handleMount: () => void;
  handleUnmount: () => void;
}

export const useComponentService = <
    ServiceType,
    ServiceParamsType,
>(
    {
      Service,
      serviceParams
    }: {
  Service: { new(serviceParams: ServiceParamsType): ServiceType; };
  serviceParams: ServiceParamsType;
}) => {
  const service = useRef<ServiceType>();

  if (!service.current) {
    service.current = new Service(serviceParams) as ServiceType;
  }

  useEffect(() => {
    const serviceInstance = service.current as ServiceType & MountableService;
    serviceInstance.handleMount();

    return (): void => {
      serviceInstance.handleUnmount();
    };
  }, []);

  return service.current;
};
