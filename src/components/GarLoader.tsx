import { useQuery,} from '@tanstack/react-query'
import { GarTable } from './GarTable';
import { useEffect, useState } from 'react';
import { pingUpdater } from '@/lib/pinger';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import GatewayDetails from './GatewayDetails';
import { z } from 'zod';
import { zGatewayAddressRegistryItem } from '@/types';
import { garQuery } from '@/lib/query';

const GarLoader = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery(garQuery);

  const {
    data: procData,
    isLoading: isProcLoading,
    isFetching: isProcFetching,
    refetch: procRefetch,
  } = useQuery({
    queryKey: ['garProc', data],
    queryFn: async () => await pingUpdater(data!),
    enabled: data !== undefined,
    placeholderData: data?.map((item) => ({
      ...item,
      ping: { status: "pending" },
      health: { status: "pending" },
    })) as Array<z.infer<typeof zGatewayAddressRegistryItem>>,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  })

  const [memData, setMemData] = useState<Array<z.infer<typeof zGatewayAddressRegistryItem>>>();
  useEffect(() => {
    if (procData !== undefined) setMemData(procData)
  }, [procData])

  const [selectedDetailsItemId, setSelectedDetailsItemId] = useState<string | undefined>(undefined)
  const selectedDetailsItem = procData?.find((item) => item.id === selectedDetailsItemId)
  
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  
  if (error) return <div>Error: {JSON.stringify(error)}</div>

  return (
    <>
      <GarTable
        data={memData ?? []}
        isRefreshing={isLoading || isProcLoading || isFetching || isProcFetching}
        onRefresh={() => {procRefetch()}}
        onItemUpdate={(updatedItem) => {
          setMemData((prevData) => {
            if (prevData === undefined) return prevData;
            const prevItemIndex = prevData.findIndex((item) => item.id === updatedItem.id)
            if (prevItemIndex === -1) return prevData;
            const newData = [...prevData]
            newData[prevItemIndex] = updatedItem
            return newData
          })
        }}
        onItemSelect={(item) => {
          setSelectedDetailsItemId(item.id)
          if (!isDetailsSheetOpen) {
            setIsDetailsSheetOpen(true)
          }
        }}
        selectedItemId={selectedDetailsItemId}
      />
      <Sheet
        open={isDetailsSheetOpen}
        // onOpenChange={(isOpen) => {
        //   setIsSheetOpen(isOpen)
        // }}
        modal={false}
      >
        <SheetContent
          side="bottom"
          onCloseButtonClick={() => {
            setIsDetailsSheetOpen(false)
            // setSelectedItemId(undefined)
          }}
        >
          <SheetHeader>
            <SheetTitle className='pb-4'>
              Gateway Details
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
            <GatewayDetails
              data={selectedDetailsItem!}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default GarLoader