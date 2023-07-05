public static class AgeCalculator
{
    public static int CalculateAge(int birthYear)
    {
        int age = DateTime.Now.Year - birthYear;
        return age;
    }
}
