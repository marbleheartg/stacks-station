import { useReadContractCount, useWriteContractIncrement } from "@/lib/abi"
import { CA } from "@/lib/constants"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { base } from "viem/chains"
import { useConnect, useConnection, useConnectors, useSwitchChain, useWaitForTransactionReceipt } from "wagmi"
import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  ChipGroup,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Radio,
  RadioGroup,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  useToast,
} from "../components/ui"

export default function UIKit() {
  const [toggleValue, setToggleValue] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [selectValue, setSelectValue] = useState("")
  const [activeTab, setActiveTab] = useState("tab1")
  const [segmentValue, setSegmentValue] = useState("day")
  const [chips, setChips] = useState(["react", "typescript", "tailwind"])
  const [selectedChip, setSelectedChip] = useState<string | null>(null)
  const { toast } = useToast()

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const selectOptions = [
    { value: "eth", label: "ethereum", icon: <span className="text-[10px]">Ξ</span> },
    { value: "base", label: "base", icon: <span className="text-[10px]">🔵</span> },
    { value: "op", label: "optimism", icon: <span className="text-[10px]">🔴</span> },
    { value: "arb", label: "arbitrum", icon: <span className="text-[10px]">🔷</span> },
  ]

  const tabItems = [
    { id: "tab1", label: "overview" },
    { id: "tab2", label: "analytics" },
    { id: "tab3", label: "settings" },
  ]

  const segmentItems = [
    { value: "day", label: "day" },
    { value: "week", label: "week" },
    { value: "month", label: "month" },
    { value: "year", label: "year" },
  ]

  const { address: userAddress, isConnected } = useConnection()

  const { data: hash, writeContract, isPending: isWriteIncrementPending } = useWriteContractIncrement()
  const { isSuccess: isIncrementSuccess, isLoading: isIncrementLoading } = useWaitForTransactionReceipt({ hash })

  const { mutate: connect } = useConnect()
  const { mutate: switchChain } = useSwitchChain()

  const connectors = useConnectors()

  const { data: count, refetch } = useReadContractCount({
    address: CA,
    query: {
      enabled: !!userAddress && isConnected,
      refetchInterval: 5000,
    },
  })

  useEffect(() => {
    if (isIncrementSuccess || isIncrementLoading) refetch()
  }, [isIncrementSuccess, isIncrementLoading, refetch])

  return (
    <main className={clsx("flex flex-col gap-5", "px-5 pt-20 pb-26", "overflow-y-scroll overflow-x-hidden")}>
      {/* Tx Sending Button */}
      <Card>
        <CardHeader>
          <CardTitle>Tx Sending Button</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>{count || <Spinner size="xs" />}</div>
          <Button
            loading={isWriteIncrementPending || isIncrementLoading}
            onClick={() => {
              try {
                connect({ connector: connectors[0] })
                switchChain({ chainId: base.id })
              } catch {}

              writeContract({ address: CA, chainId: base.id })
            }}
          >
            click me
          </Button>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="danger">danger</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">small</Button>
            <Button size="md">medium</Button>
            <Button size="lg">large</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button loading={loading} onClick={handleButtonClick}>
              {loading ? "loading..." : "click me"}
            </Button>
            <Button disabled>disabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* Icon Buttons with Tooltip */}
      <Card>
        <CardHeader>
          <CardTitle>icon buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Tooltip content="settings" position="bottom">
            <IconButton aria-label="Settings" variant="default">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </IconButton>
          </Tooltip>
          <Tooltip content="add to favorites" position="bottom">
            <IconButton aria-label="Heart" variant="ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </IconButton>
          </Tooltip>
          <Tooltip content="delete item" position="bottom">
            <IconButton aria-label="Delete" variant="danger">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </IconButton>
          </Tooltip>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>inputs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input label="username" placeholder="enter your username" hint="this will be visible to others" />
          <Input
            label="search"
            type="search"
            placeholder="search..."
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
          <Input label="amount" type="number" placeholder="0.00" error="amount must be positive" />
          <Textarea label="bio" placeholder="tell us about yourself..." rows={3} />
        </CardContent>
      </Card>

      {/* Select */}
      <Card>
        <CardHeader>
          <CardTitle>select</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select label="network" options={selectOptions} value={selectValue} onChange={setSelectValue} placeholder="choose a network" />
          <Select label="disabled select" options={selectOptions} value="eth" disabled />
        </CardContent>
      </Card>

      {/* Slider */}
      <Card>
        <CardHeader>
          <CardTitle>slider</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Slider label="volume" value={sliderValue} onChange={setSliderValue} showValue />
          <Slider label="brightness" value={75} variant="success" size="sm" showValue />
          <Slider value={30} variant="warning" />
        </CardContent>
      </Card>

      {/* Checkbox & Radio */}
      <Card>
        <CardHeader>
          <CardTitle>checkbox & radio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60 mb-1">checkboxes</span>
            <Checkbox checked={checkboxValue} onChange={setCheckboxValue} label="enable notifications" description="receive updates about your account" />
            <Checkbox checked disabled label="required option" />
            <Checkbox indeterminate label="partial selection" />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60 mb-1">radio group</span>
            <RadioGroup value={radioValue} onChange={setRadioValue} name="example">
              <Radio value="option1" label="option one" description="the first choice" />
              <Radio value="option2" label="option two" description="the second choice" />
              <Radio value="option3" label="option three" disabled />
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>toggle</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Toggle checked={toggleValue} onChange={setToggleValue} />
          <span className="text-(--text)">{toggleValue ? "on" : "off"}</span>
          <Divider orientation="vertical" className="h-6" />
          <Toggle checked={toggleValue} onChange={setToggleValue} size="sm" />
          <Toggle checked disabled />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>tabs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60">default</span>
            <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} fullWidth />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60">pills</span>
            <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60">underline</span>
            <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} variant="underline" fullWidth />
          </div>
        </CardContent>
      </Card>

      {/* Segmented Control */}
      <Card>
        <CardHeader>
          <CardTitle>segmented control</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SegmentedControl segments={segmentItems} value={segmentValue} onChange={setSegmentValue} fullWidth />
          <SegmentedControl segments={segmentItems.slice(0, 3)} value={segmentValue} onChange={setSegmentValue} size="sm" />
        </CardContent>
      </Card>

      {/* Chips */}
      <Card>
        <CardHeader>
          <CardTitle>chips</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60">removable chips</span>
            <ChipGroup>
              {chips.map((chip) => (
                <Chip key={chip} removable onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}>
                  {chip}
                </Chip>
              ))}
            </ChipGroup>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-(--text)/60">selectable chips</span>
            <ChipGroup>
              {["all", "pending", "completed", "failed"].map((chip) => (
                <Chip
                  key={chip}
                  clickable
                  selected={selectedChip === chip}
                  onClick={() => setSelectedChip(chip === selectedChip ? null : chip)}
                  variant={
                    chip === "completed" ? "success"
                    : chip === "failed" ?
                      "danger"
                    : "default"
                  }
                >
                  {chip}
                </Chip>
              ))}
            </ChipGroup>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>default</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="info">info</Badge>
          <Badge variant="success" dot>
            with dot
          </Badge>
          <Badge size="sm">small</Badge>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Alert variant="info" title="heads up!">
            this is an informational message to keep you updated.
          </Alert>
          <Alert variant="success" title="success!">
            your transaction has been confirmed on the blockchain.
          </Alert>
          <Alert variant="warning" title="warning">
            gas prices are currently high. consider waiting.
          </Alert>
          <Alert variant="danger" title="error" closable onClose={() => toast("alert dismissed")}>
            transaction failed. please try again.
          </Alert>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card>
        <CardHeader>
          <CardTitle>avatars</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="xs" fallback="JD" />
            <Avatar size="sm" fallback="JD" />
            <Avatar size="md" src="https://i.pravatar.cc/150?img=1" />
            <Avatar size="lg" src="https://i.pravatar.cc/150?img=2" status="online" />
            <Avatar size="xl" src="https://i.pravatar.cc/150?img=3" bordered />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-(--text)/60">status:</span>
            <Avatar size="sm" src="https://i.pravatar.cc/150?img=4" status="online" />
            <Avatar size="sm" src="https://i.pravatar.cc/150?img=5" status="away" />
            <Avatar size="sm" src="https://i.pravatar.cc/150?img=6" status="busy" />
            <Avatar size="sm" src="https://i.pravatar.cc/150?img=7" status="offline" />
          </div>
          <div>
            <span className="text-[10px] text-(--text)/60 mb-2 block">avatar group:</span>
            <AvatarGroup max={4}>
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=8" bordered />
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=9" bordered />
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=10" bordered />
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=11" bordered />
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=12" bordered />
              <Avatar size="sm" src="https://i.pravatar.cc/150?img=13" bordered />
            </AvatarGroup>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Progress value={75} showLabel />
            <Progress value={45} variant="success" size="sm" />
            <Progress value={25} variant="warning" />
            <Progress value={90} variant="danger" />
          </div>
          <Divider />
          <div className="flex items-center justify-around">
            <CircularProgress value={25} />
            <CircularProgress value={50} size={56} />
            <CircularProgress value={75} size={64} strokeWidth={6} />
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>loading states</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
          <Divider label="skeleton" />
          <div className="flex items-center gap-3">
            <Skeleton width={40} height={40} rounded="full" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton height={12} width="60%" />
              <Skeleton height={10} width="40%" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card padding="none">
        <CardHeader className="px-4 pt-4">
          <CardTitle>accordion</CardTitle>
        </CardHeader>
        <div className="px-4 pb-2">
          <Accordion defaultOpenItems={["faq1"]}>
            <AccordionItem id="faq1" title="what is this ui kit?" subtitle="learn the basics">
              this is a comprehensive ui kit built with react, tailwind css, and glassmorphism design principles. it includes all the components you need to build beautiful mini
              apps.
            </AccordionItem>
            <AccordionItem id="faq2" title="how do i use it?">
              simply import the components you need from the ui folder and use them in your app. all components support haptic feedback and are optimized for mobile.
            </AccordionItem>
            <AccordionItem id="faq3" title="can i customize it?">
              yes! all components use css variables defined in globals.css. you can easily customize the color scheme by modifying the oklch values.
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      {/* List */}
      <Card padding="none">
        <CardHeader className="px-4 pt-4">
          <CardTitle>list</CardTitle>
        </CardHeader>
        <List className="px-3">
          <ListItem
            title="john doe"
            subtitle="@johndoe"
            leftContent={<Avatar size="sm" src="https://i.pravatar.cc/150?img=1" />}
            rightContent={
              <Badge variant="success" size="sm">
                online
              </Badge>
            }
            clickable
          />
          <ListItem
            title="jane smith"
            subtitle="@janesmith"
            leftContent={<Avatar size="sm" src="https://i.pravatar.cc/150?img=2" />}
            rightContent={<Badge size="sm">offline</Badge>}
            clickable
          />
          <ListItem
            title="alex johnson"
            subtitle="@alexj"
            leftContent={<Avatar size="sm" src="https://i.pravatar.cc/150?img=3" />}
            rightContent={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--text)/50">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            }
            clickable
          />
        </List>
      </Card>

      {/* Cards Variants */}
      <Card>
        <CardHeader>
          <CardTitle>card variants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Card variant="default" padding="sm">
            <span className="text-[10px]">default card</span>
          </Card>
          <Card variant="elevated" padding="sm">
            <span className="text-[10px]">elevated card</span>
          </Card>
          <Card variant="glass" padding="sm">
            <span className="text-[10px]">flat card</span>
          </Card>
          <Card variant="default" padding="sm" hoverable>
            <span className="text-[10px]">hoverable card</span>
          </Card>
        </CardContent>
      </Card>

      {/* Tooltips */}
      <Card>
        <CardHeader>
          <CardTitle>tooltips</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 justify-center">
          <Tooltip content="appears on top" position="top">
            <Button variant="ghost" size="sm">
              top
            </Button>
          </Tooltip>
          <Tooltip content="appears on bottom" position="bottom">
            <Button variant="ghost" size="sm">
              bottom
            </Button>
          </Tooltip>
          <Tooltip content="appears on left" position="left">
            <Button variant="ghost" size="sm">
              left
            </Button>
          </Tooltip>
          <Tooltip content="appears on right" position="right">
            <Button variant="ghost" size="sm">
              right
            </Button>
          </Tooltip>
        </CardContent>
      </Card>

      {/* Modal & Toast */}
      <Card>
        <CardHeader>
          <CardTitle>overlays</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            open modal
          </Button>
          <Button variant="ghost" onClick={() => toast("this is a toast message")}>
            show toast
          </Button>
          <Button variant="ghost" onClick={() => toast("action completed!", "success")}>
            success toast
          </Button>
          <Button variant="ghost" onClick={() => toast("something went wrong", "error")}>
            error toast
          </Button>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader onClose={() => setModalOpen(false)}>example modal</ModalHeader>
        <ModalBody>
          <p className="text-(--text)">this is a modal dialog. you can put any content here. click outside or press escape to close.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            cancel
          </Button>
          <Button onClick={() => setModalOpen(false)}>confirm</Button>
        </ModalFooter>
      </Modal>

      {/* Dividers */}
      <Card>
        <CardHeader>
          <CardTitle>dividers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Divider />
          <Divider label="or continue with" />
          <div className="flex items-center h-8 gap-4">
            <span>item 1</span>
            <Divider orientation="vertical" />
            <span>item 2</span>
            <Divider orientation="vertical" />
            <span>item 3</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
