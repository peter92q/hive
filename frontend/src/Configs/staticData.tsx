export const htags = ['yoga','meditaion','rock','metal','pop','rap','hip-hop','netflix',
  'piano', 'football', 'food', 'movies', 'concerts', 'running', 'dancing', 'reading',
  'coding','gym','nightlife','vegan','video games', 'climbing','hiking','sports',
  'nba','nfl','mma','science','animals','cats','dogs','beer','coffee','pickles']

export const randomColor = [
    "bg-green-700",
    "bg-purple-700",
    "bg-orange-700",
    "bg-blue-700",
    "bg-pink-700",
    "bg-red-700",
    "bg-yellow-700",
    "bg-indigo-700",
    "bg-cyan-700",
    "bg-lime-700",
    "bg-amber-700",
    "bg-crimson-700",
    "bg-slate-700",
    "bg-magenta-700",
    "bg-emerald-700",
    "bg-violet-700",
  
  ];

const TableHeader = ()=> {
  return(
    <tr className="text-white w-[100%] flex flex-row justify-between ">
    <td className="w-[10%] border-[1px] border-yellow-700/50 px-1">Pic</td>
    <td className="w-[20%] border-[1px] border-yellow-700/50 px-1">Username</td>
    <td className="md:w-[50%] w-[45%] border-[1px] border-yellow-700/50 px-1">Last Message</td>
    <td className="w-[10%] border-[1px] border-yellow-700/50 px-1">New</td>
    <td className="md:w-[10%] w-[15%] border-[1px] border-yellow-700/50 px-1">Delete</td>
  </tr> 
  )
}
export default TableHeader;