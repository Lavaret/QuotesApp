<template>
  <div class="flex m-2">
    <div class="bg-stone-300 w-1/4"></div>
    <div class="bg-stone-200 min-h-32 w-1/2 flex flex-col gap-12">
      <div class="font-bold p-3">
        <h1 class="header-1 ">Welcome to the homepage</h1>
      </div>
      <div class="space-y-4">
        <Quote>
          <template #author>
            Albert Einstein
          </template>
          <template #content>
            If you can't explain it simply, you don't understand it well enough.
          </template>
        </Quote>

        <Quote>
          <template #author>
            Lara Croft
          </template>
          <template #content>
            Czasami odwaga jednego może przeważyć nad tchórzostwem wielu.
          </template>
        </Quote>

        <Quote>
          <template #author>
            Dr Sayer
          </template>
          <template #content>
            Przepraszam, gdybyś miał rację, tobym się z Tobą zgodził.
          </template>
          <template #source>
            przebudzenia (film)
          </template>
        </Quote>

        <Quote>
          <template #author>
            Joseph Townsend
          </template>
          <template #content>
            W zasadzie tylko głód potrafi pobudzić ubogich do pracy.
          </template>
          <template #source>
            Głód s. 245
          </template>
        </Quote>

        <Quote>
          <template #content>
            Jeszcze jedną niezwykłą cechą jego wykładów było to, że nie unikał słów "nie wiemy". "Nie wiemy" było kierunkowskazem
            do odkrycia nowej prawdy, a nie wstydliwym przyznaniem się do niewiedzy.
          </template>
          <template #source>
            Ukochane równanie profesora
          </template>
        </Quote>

        <Quote>
          <template #content>
            Im więcej możesz tym skromniej używaj.
          </template>
          <template #author>
            Marek Aureliusz
          </template>
        </Quote>

        <Quote>
          <template #content>
            Ani skarby ani armia ani władza nie ocalą władcy, na tronie bezpieczni są tylko Ci, których otacza miłość.
          </template>
          <template #author>
            Marek Aureliusz
          </template>
        </Quote>

      </div>
    </div>
    <div class="bg-stone-300 w-1/4"></div>

  </div>
</template>
